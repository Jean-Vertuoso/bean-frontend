import { Component, inject, signal, WritableSignal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ProductService } from './../../product/services/product.service';
import { ClientService } from '../../client/services/client.service';
import { SaleService } from '../services/sale.service';

import { FormInputComponent } from '../../../shared/components/form/form-input/form-input.component';
import { DefaultFormLayoutComponent } from "../../../shared/components/layout/default-form-layout/default-form-layout.component";
import { FormUtilityButtonComponent } from "../../../shared/components/form/form-utility-button/form-utility-button.component";
import { FormUtilitySelectComponent } from "../../../shared/components/form/form-utility-select/form-utility-select.component";

import { ProductResponse } from '../../../shared/models/product.model';
import { ClientResponse } from '../../../shared/models/client.model';
import { OrderItem } from '../../../shared/models/order-item.model';
import { SaleRequest, SaleResponse } from '../../../shared/models/sale.model';
import Swal from 'sweetalert2';

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
    templateUrl: './new-sale.component.html',
    styleUrls: ['./new-sale.component.scss'],
})
export class NewSaleComponent {
    private clientService = inject(ClientService);
    private productService = inject(ProductService);
    private saleService = inject(SaleService);

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
    public totalDiscount = signal(0);

    public orderItems = signal<OrderItem[]>([
        { productId: undefined, name: '', quantity: 1, unitPrice: 0, subtotal: 0, locked: false }
    ]);

    public paymentMethod = signal('cash');
    public installments = signal(1);

    public paymentMethods = [
        { label: 'Dinheiro', value: 'cash' },
        { label: 'Cartão de crédito', value: 'credit' },
        { label: 'Cartão de débito', value: 'debit' },
    ];

    constructor() {
		this.cashSessionId.set(2);
        effect(() => {
            const search = this.clientSearchModel();
            this.productInputs.set(this.orderItems().map(item => item.name));

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

    public get total(): string {
        const totalValue = this.orderItems().reduce(
            (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
            0
        );
        return `R$ ${totalValue.toFixed(2)}`;
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

    public selectClient(client: ClientResponse): void {
        this.selectedClient.set(client);
        this.selectedClientId.set(client.id);
        this.clientSearchModel.set(`${client.id} - ${client.name}`);
    }

    public clearSelectedClient(): void {
        this.selectedClient.set(null);
        this.selectedClientId.set(null);
        this.clientSearchModel.set('');
        this.clientResults.set([]);
    }

    public addItem(): void {
        this.orderItems.update(items => {
            const newItems = [...items, { productId: undefined, name: '', quantity: 1, unitPrice: 0, subtotal: 0, locked: false }];
            this.productInputs.set(newItems.map(item => item.name));
            return newItems;
        });
    }

    public removeItem(index: number): void {
        this.orderItems.update(items => items.filter((_, i) => i !== index));
        this.productInputs.update(inputs => inputs.filter((_, i) => i !== index));
    }

    public updateSubtotal(index: number): void {
        const items = this.orderItems();
        const item = items[index];
        const discount = item.discount ?? 0;
        item.subtotal = (item.quantity * item.unitPrice) - discount;
        this.orderItems.set([...items]);
    }

    public selectProduct(index: number, product: ProductResponse): void {
		this.orderItems.update(items => {
			const quantity = items[index].quantity ?? 1;
			items[index] = {
				...items[index],
				productId: product.id,
				name: product.name,
				unitPrice: product.price,
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

    public buildSaleRequest(): SaleRequest {
        if (!this.selectedClientId()) throw new Error('Selecione um cliente');
        if (!this.cashSessionId()) throw new Error('Sessão de caixa não iniciada');

        const paymentMap: Record<string, number> = { cash: 1, credit: 2, debit: 3 };
        const items = this.orderItems()
						.filter(item => item.locked && item.productId != null)
						.map(item => ({
							productId: item.productId!,
							quantity: item.quantity,
							discount: item.discount ?? 0
						}));

        if (items.length === 0) throw new Error('Adicione pelo menos um produto antes de salvar a venda');

        return {
            clientId: this.selectedClientId()!,
            cashSessionId: this.cashSessionId()!,
            paymentMethod: paymentMap[this.paymentMethod()]!,
            totalDiscount: this.totalDiscount(),
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
				cancelButtonText: 'Não'
			}).then((result) => {
				if (result.isConfirmed) {
					this.saleService.saveSale(request).subscribe({
						next: (res: SaleResponse) => {
							Swal.fire({
								title: 'Venda finalizada!',
								text: 'A venda foi concluída com sucesso.',
								icon: 'success',
								confirmButtonText: 'Ok'
							});
							this.resetForm();
						},
						error: (err: unknown) => {
							console.error('Erro ao salvar venda:', err);
							Swal.fire({
								title: 'Erro',
								text: 'Não foi possível finalizar a venda.',
								icon: 'error',
								confirmButtonText: 'Ok'
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
				confirmButtonText: 'Ok'
			});
		}
	}

    private resetForm(): void {
        this.selectedClient.set(null);
        this.selectedClientId.set(null);
        this.clientSearchModel.set('');
        this.clientResults.set([]);
        this.orderItems.set([{ productId: undefined, name: '', quantity: 1, unitPrice: 0, subtotal: 0, discount: 0, locked: false }]);
        this.productInputs.set(['']);
        this.productResults.set([]);
        this.productSearchModel.set('');
        this.productSearchIndex.set(null);
        this.paymentMethod.set('cash');
        this.installments.set(1);
        this.totalDiscount.set(0);
    }
}
