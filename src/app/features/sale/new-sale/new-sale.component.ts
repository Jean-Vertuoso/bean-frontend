import { ProductService } from './../../product/services/product.service';
import { Component, effect, inject, signal, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../shared/components/form/form-input/form-input.component';
import { ClientService } from '../../client/services/client.service';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DefaultFormLayoutComponent } from "../../../shared/components/layout/default-form-layout/default-form-layout.component";
import { FormUtilityButtonComponent } from "../../../shared/components/form/form-utility-button/form-utility-button.component";
import { FormUtilitySelectComponent } from "../../../shared/components/form/form-utility-select/form-utility-select.component";
import { ProductResponse } from '../../../shared/models/product.model';
import { ClientResponse } from '../../../shared/models/client.model';
import { OrderItem } from '../../../shared/models/order-item.model';

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

	public clientSearch = signal('');
	public clientSearchInput = '';
	public clientSearchModel: WritableSignal<string> = signal('');
	public clientResults = signal<ClientResponse[]>([]);
	public focusedInput = signal<string | number | null>(null);
	public productSearchIndex = signal<number | null>(null);
	public productSearchModel = signal('');
	public productInputs = signal<string[]>(['']);
	public productResults = signal<ProductResponse[]>([]);
	public selectedClient = signal<ClientResponse | null>(null);
	public selectedClientId = signal<number | null>(null);

	public orderItems = signal<OrderItem[]>([
		{
			name: '',
			quantity: 1,
			unitPrice: 0,
			subtotal: 0,
			locked: false,
		},
	]);

	public productSearch = signal('');
	public paymentMethod = signal('cash');
	public installments = signal(1);
	public hovered = -1;

	public displayedColumns = ['name', 'quantity', 'unitPrice', 'total'];

	public paymentMethods = [
		{ label: 'Dinheiro', value: 'cash' },
		{ label: 'Cartão de crédito', value: 'credit' },
		{ label: 'Cartão de débito', value: 'debit' },
	];

	constructor() {
		effect(() => {
			const search = this.clientSearchModel();
			this.productInputs.set(this.orderItems().map(item => item.name));

			if (this.selectedClient()) return;

			if (search.trim().length > 0) {
				this.clientService.findByNameContaining(search).subscribe((clients) => {
					this.clientResults.set(clients);
				});
			} else {
				this.clientResults.set([]);
			}
		});

		effect(() => {
			const term = this.productSearchModel().trim();

			if (term.length > 0) {
				this.productService.findByNameContainingIgnoreCaseOrBarCode(term).subscribe((products) => {
					this.productResults.set(products);
				});
			} else {
				this.productResults.set([]);
			}
		});
	}

	public get total(): number {
		return this.orderItems().reduce(
			(sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
			0
		);
	}

	public get clientSearchModelValue(): string {
		return this.clientSearchModel();
	}
	public set clientSearchModelValue(value: string) {
		this.clientSearchModel.set(value);
		this.clientSearch.set(value);
	}

	public get paymentMethodValue(): string {
		return this.paymentMethod();
	}
	public set paymentMethodValue(val: string) {
		this.paymentMethod.set(val);
	}

	public onInputBlur(): void {
		setTimeout(() => {
			this.focusedInput.set(null);
		}, 0);
	}

	public onInputChange(value: string): void {
		this.clientSearch.set(value);
		this.clientSearchModel.set(value);
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

	public updateQuantity(productId: number, qty: number): void {
		if (qty < 1) qty = 1;
	}

	public trackByClientId(index: number, client: ClientResponse): number {
		return client.id;
	}

	public addEmptyItem(): void {
		this.orderItems.update(items => [
			...items,
			{
				name: '',
				quantity: 1,
				unitPrice: 0,
				subtotal: 0,
				locked: false
			}
		]);
		this.productInputs.update(inputs => [...inputs, '']);
	}

	public addItem(): void {
		this.orderItems.update(items => {
			const newItems = [...items, {
				name: '',
				quantity: 1,
				unitPrice: 0,
				subtotal: 0,
				locked: false,
			}];
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
		item.subtotal = item.quantity * item.unitPrice;
		this.orderItems.set([...items]);
	}

	public selectProduct(index: number, product: ProductResponse): void {
		this.orderItems.update(items => {
			const quantity = items[index].quantity ?? 1;
			const unitPrice = product.price;
			const subtotal = quantity * unitPrice;

			items[index].name = product.name;
			items[index].unitPrice = unitPrice;
			items[index].subtotal = subtotal;
			items[index].locked = true;
			return [...items];
		});

		this.productInputs.update(inputs => {
			inputs[index] = product.name;
			return [...inputs];
		});

		this.productResults.set([]);
		this.productSearchIndex.set(null);
	}

	public onProductSelect(index: number): void {
		const items = this.orderItems();
		const selected = items[index];
		if (selected.name) {
			selected.locked = true;
			this.updateSubtotal(index);
			this.orderItems.set([...items]);
		}
	}

	onProductInputChange(value: string, index: number): void {
		const term = value.trim();
		this.productSearchIndex.set(index);
		this.productSearchModel.set(term);

		if (term.length === 0) {
			this.productResults.set([]);
			return;
		}

		this.productService.findByNameContainingIgnoreCaseOrBarCode(term)
			.subscribe((results) => {
				const exactMatch = results.length === 1 && results[0].barCode === term;

				if (exactMatch) {
					this.selectProduct(index, results[0]);
				} else {
					this.productResults.set(results);
				}
			});
	}
}
