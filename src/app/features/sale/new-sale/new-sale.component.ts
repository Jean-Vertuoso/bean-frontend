import { Component, inject, signal, WritableSignal, effect, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CashSessionService } from './../../cash-session/cash-session.service';
import { ProductService } from './../../product/services/product.service';
import { ClientService } from '../../client/services/client.service';
import { SaleService } from '../services/sale.service';

import { FormInputComponent } from '../../../shared/components/form/form-input/form-input.component';
import { DefaultFormLayoutComponent } from "../../../shared/components/layout/default-form-layout/default-form-layout.component";
import { FormUtilityButtonComponent } from "../../../shared/components/form/form-utility-button/form-utility-button.component";
import { FormUtilitySelectComponent } from "../../../shared/components/form/form-utility-select/form-utility-select.component";

import { ProductResponse } from '../../../shared/models/product.model';
import { ClientResponse } from '../../../shared/models/client.model';
import { SaleItem } from '../../../shared/models/sale-item.model';
import Swal from 'sweetalert2';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { take } from 'rxjs';
import { Sale } from '../../../shared/models/sale.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-sale',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        FormInputComponent,
        MatTableModule,
        MatInputModule,
        MatSelectModule,
        DefaultFormLayoutComponent,
        FormUtilityButtonComponent,
        FormUtilitySelectComponent
    ],
	providers: [
		CurrencyPipe,
		provideNgxMask()
	],
    templateUrl: './new-sale.component.html',
    styleUrls: ['./new-sale.component.scss'],
})
export class NewSaleComponent {
	@ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
    public cashSessionId = signal<number | null>(null);
    public clientSearchModel: WritableSignal<string> = signal('');
    public clientResults = signal<ClientResponse[]>([]);
    public focusedInput = signal<string | number | null>(null);
    public productSearchIndex = signal<number | null>(null);
    public productSearchModel = signal('');
    public productInputs = signal<string[]>(['']);
    public productResults = signal<ProductResponse[]>([]);
    public selectedClient = signal<ClientResponse | null>(null);
    public selectedClientId = signal<number | null>(null);
    public totalDiscount = signal<number>(0);
    public amountReceived = signal<number>(0);
    public change = signal<number>(0);
	public cashReceived = signal<number>(0);

    public saleItems = signal<SaleItem[]>([
        { productId: undefined, name: '', quantity: 1, price: 0, discount: 0, subtotal: 0, locked: false }
    ]);

    public paymentMethod = signal('cash');
    public installments = signal(1);

    public paymentMethods = [
        { label: 'Boleto Bancário', value: 'BANK_SLIP' },
        { label: 'Dinheiro', value: 'CASH' },
        { label: 'Cheque', value: 'CHECK' },
        { label: 'Cartão de Crédito', value: 'CREDIT_CARD' },
        { label: 'Cartão de Débito', value: 'DEBIT_CARD' },
        { label: 'Crediário', value: 'INSTALLMENT_PLAN' },
        { label: 'Pix', value: 'PIX' },
    ];

    constructor(
		private cashSessionService: CashSessionService,
		private clientService: ClientService,
		private productService: ProductService,
		private saleService: SaleService,
		private currencyPipe: CurrencyPipe,
		private router: Router
	) {
		this.cashSessionService = cashSessionService;
		this.clientService = clientService;
		this.productService = productService;
		this.saleService = saleService;
		this.currencyPipe = currencyPipe;

        effect(() => {
            const search = this.clientSearchModel();
            this.productInputs.set(this.saleItems().map(item => item.name));

            if (this.selectedClient()) return;

            if (search.trim().length > 0) {
                this.clientService.findByNameContaining(search)
                    .subscribe(clients => this.clientResults.set(clients));
            } else {
                this.clientResults.set([]);
            }
        });

        effect(() => {
            const term = this.productSearchModel().trim();
            const index = this.productSearchIndex();
            if (!index && index !== 0) return;

            if (term.length > 0) {
                this.productService.findByNameContainingIgnoreCaseOrBarCode(term)
                    .subscribe(products => this.productResults.set(products));
            } else {
                this.productResults.set([]);
            }
        });
    }

	ngOnInit(): void {
		this.checkActiveCashSession();
	}

	totalRaw = computed(() =>
		this.saleItems().reduce((sum, item) => sum + (item.subtotal ?? 0), 0)
	);

	totalWithDiscount = computed(() => {
		const discount = this.totalDiscount();

		const result = this.totalRaw() - discount;
		return result < 0 ? 0 : result;
	});

	formattedTotal = computed(() =>
		this.currencyPipe.transform(
			this.totalWithDiscount(),
			'BRL',
			'symbol',
			'1.2-2')
			??
			'R$ 0,00'
	);

	public get calculateChange(): number {
		const received = this.cashReceived();
		const total = this.totalWithDiscount();
		return received > total ? received - total : 0;
	}

    public get clientSearchModelValue(): string {
        return this.clientSearchModel();
    }
    public set clientSearchModelValue(value: string) {
        this.clientSearchModel.set(value);
    }

    public get paymentMethodValue(): string {
        return this.paymentMethod();
    }
    public set paymentMethodValue(val: string) {
        this.paymentMethod.set(val);
    }

    public onInputBlur(): void {
        setTimeout(() => this.focusedInput.set(null), 0);
    }

    public onClientInput(raw: string): void {
        this.selectedClient.set(null);
        this.selectedClientId.set(null);
        this.clientSearchModel.set(raw ?? '');
    }

    public selectClient(client: ClientResponse): void {
        this.selectedClient.set(client);
        this.selectedClientId.set(client.id);
        this.clientSearchModel.set(`${client.id} - ${client.name}`);
        this.clientResults.set([]);
        setTimeout(() => {
            this.focusedInput.set(0);
            this.productSearchIndex.set(0);
            this.productSearchModel.set(this.productInputs()[0] ?? '');
        }, 0);
    }

    public clearSelectedClient(): void {
        this.selectedClient.set(null);
        this.selectedClientId.set(null);
        this.clientSearchModel.set('');
        this.clientResults.set([]);
    }

    public addItem(): void {
        this.saleItems.update(items => {
            const newItems = [...items, { productId: undefined, name: '', quantity: 1, price: 0, discount: 0, subtotal: 0, locked: false }];
            this.productInputs.set(newItems.map(item => item.name));
            return newItems;
        });

		setTimeout(() => {
			if (this.tableContainer) {
				this.tableContainer.nativeElement.scrollTop = this.tableContainer.nativeElement.scrollHeight;
			}
		}, 0);
    }

    public removeItem(index: number): void {
        this.saleItems.update(items => items.filter((_, i) => i !== index));
        this.productInputs.update(inputs => inputs.filter((_, i) => i !== index));
    }

    public updateSubtotal(index: number): void {
		const items = this.saleItems();
		const item = items[index];

		const quantity = item.quantity ?? 0;

		const unitPrice = item.price;

		const discount = item.discount ? item.discount : 0;

		let subtotal = (quantity * unitPrice) - discount;
		item.subtotal = subtotal > 0 ? subtotal : 0;

		this.saleItems.set([...items]);
	}

    public selectProduct(index: number, product: ProductResponse): void {
        this.saleItems.update(items => {
            const quantity = items[index].quantity ?? 1;
            items[index] = {
                ...items[index],
                productId: product.id,
                name: product.name,
                price: product.price,
                subtotal: quantity * product.price,
                locked: true
            };
            return [...items];
        });

        this.productInputs.update(inputs => {
            inputs[index] = product.name;
            return [...inputs];
        });

        this.productResults.set([]);
        this.productSearchIndex.set(null);
        this.focusedInput.set(null);
    }

    public onProductInputChange(value: string, index: number): void {
        this.productSearchIndex.set(index);
        this.productSearchModel.set(value.trim());

        if (!value.trim()) {
            this.productResults.set([]);
            return;
        }

        this.productService.findByNameContainingIgnoreCaseOrBarCode(value.trim())
            .subscribe(results => {
                const exactMatch = results.length === 1 && results[0].barCode === value.trim();
                if (exactMatch) {
                    this.selectProduct(index, results[0]);
                } else {
                    this.productResults.set(results);
                }
            });
    }

    public onProductFocus(index: number): void {
        this.focusedInput.set(index);
        this.productSearchIndex.set(index);
        this.productSearchModel.set(this.productInputs()[index] ?? '');
    }

    public buildSaleRequest(): Sale {
        if (!this.selectedClientId()) throw new Error('Selecione um cliente');
        if (!this.cashSessionId()) throw new Error('Sessão de caixa não iniciada');

        const paymentMap: Record<string, number> = {
			BANK_SLIP: 0,
			CASH: 1,
			CHECK: 2,
			CREDIT_CARD: 3,
			DEBIT_CARD: 4,
			INSTALLMENT_PLAN: 5,
			PIX: 6
		};
        const items = this.saleItems()
                        .filter(item => item.locked && item.productId != null)
                        .map(item => ({
                            productId: item.productId,
							name: item.name,
                            quantity: item.quantity,
							price: item.price,
                            discount: item.discount ?? 0,
							subtotal: item.subtotal,
							locked: item.locked
                        }));

        if (items.length === 0) throw new Error('Adicione pelo menos um produto antes de salvar a venda');

        return {
            clientId: this.selectedClientId()!,
            cashSessionId: this.cashSessionId()!,
            paymentMethod: paymentMap[this.paymentMethod()]!,
            totalDiscount: this.totalDiscount(),
			amountReceived: this.cashReceived(),
			change: this.calculateChange,
            items
        };
    }

    public onSubmit(): void {
        try {
            const request = this.buildSaleRequest();
            Swal.fire({
                title: 'Finalizar venda?',
                text: 'Deseja realmente finalizar a venda?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
				customClass: {
					popup: 'swal2-popup-custom'
				}
            }).then((result) => {
                if (result.isConfirmed) {
                    this.saleService.saveSale(request).subscribe({
                        next: (res: Sale) => {
                            Swal.fire({
                                title: 'Venda finalizada!',
                                text: 'A venda foi concluída com sucesso.',
                                icon: 'success',
                                confirmButtonText: 'Ok',
								customClass: {
									popup: 'swal2-popup-custom'
								}
                            });
                            this.resetForm();
                        },
                        error: (err: unknown) => {
                            console.error('Erro ao salvar venda:', err);
                            Swal.fire({
                                title: 'Erro',
                                text: 'Não foi possível finalizar a venda.',
                                icon: 'error',
                                confirmButtonText: 'Ok',
								customClass: {
									popup: 'swal2-popup-custom'
								}
                            });
                        }
                    });
                }
            });

        } catch (e) {
            Swal.fire({
                title: 'Erro',
                text: e instanceof Error ? e.message : 'Erro inesperado ao montar a venda.',
                icon: 'error',
                confirmButtonText: 'Ok',
				customClass: {
					popup: 'swal2-popup-custom'
				}
            });
        }
    }

	private checkActiveCashSession() {
		this.cashSessionService.getActiveCashSession().subscribe({
			next: (session) => {
				if (!session) {
					this.showNoSessionAlert();
				} else {
					this.cashSessionId = signal<number>(session);
				}
			},
			error: (err) => {
				if (err.status === 404) {
					this.showNoSessionAlert();
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Erro',
						text: 'Não foi possível verificar a Sessão de Caixa.',
						confirmButtonText: 'OK',
						allowOutsideClick: false
					}).then(() => {
						this.router.navigate(['/home']);
					});
				}
			}
		});
	}

	private showNoSessionAlert() {
		Swal.fire({
			icon: 'warning',
			title: 'Sessão de Caixa necessária',
			html: 'Para criar uma nova venda, você precisa de uma Sessão de Caixa ativa. <br>Por favor <strong>inicie uma nova Sessão de Caixa.</strong>',
			confirmButtonText: 'OK',
			allowOutsideClick: false
		}).then(() => {
			this.router.navigate(['/home']);
		});
	}

    private resetForm(): void {
        this.selectedClient.set(null);
        this.selectedClientId.set(null);
        this.clientSearchModel.set('');
        this.clientResults.set([]);
        this.saleItems.set([{ productId: undefined, name: '', quantity: 1, price: 0, subtotal: 0, discount: 0, locked: false }]);
        this.productInputs.set(['']);
        this.productResults.set([]);
        this.productSearchModel.set('');
        this.productSearchIndex.set(null);
        this.paymentMethod.set('cash');
        this.installments.set(1);
        this.totalDiscount.set(0);
		this.cashReceived.set(0);
    }

}
