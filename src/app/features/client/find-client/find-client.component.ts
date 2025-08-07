import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientResponse } from '../../../shared/models/client.model';
import { ClientService } from '../services/client.service';
import { FormUtilityButtonComponent } from "../../../shared/components/form/form-utility-button/form-utility-button.component";
import { FormInputComponent } from "../../../shared/components/form/form-input/form-input.component";

interface Address {
	street: string;
	number: string;
	complement?: string;
	neighborhood: string;
	city: string;
	state: string;
	postalCode: string;
}

@Component({
	standalone: true,
	selector: 'app-find-client',
	templateUrl: './find-client.component.html',
	styleUrls: ['./find-client.component.scss'],
	imports: [
		CommonModule,
		FormsModule,
		FormUtilityButtonComponent,
		FormInputComponent
	],
})
export class FindClientComponent {
	clients = signal<ClientResponse[]>([]);
	nameFieldEnabled = signal(false);
	emailFieldEnabled = signal(false);
	docNumberFieldEnabled = signal(false);
	phoneFieldsEnabled = signal<Record<number, { areaCode: boolean; number: boolean }>>({});
	searchTerm = signal('');
	selectedClient = signal<ClientResponse | null>(null);
	selectedTab = signal<'general' | 'address' | 'contacts' | 'manageClient'>('general');
	expandedAddresses = signal<Set<number>>(new Set());
	clientAddresses = signal<Address[]>([]);

	filteredClients = computed(() => {
		const term = this.searchTerm().toLowerCase();
		return this.clients().filter(c =>
			c.name.toLowerCase().includes(term) ||
			c.email.toLowerCase().includes(term)
		);
	});

	constructor(private clientService: ClientService) {
		this.loadClients();
	}

	loadClients() {
		this.clientService.getAll().subscribe({
			next: (data) => this.clients.set(data),
			error: () => alert('Erro ao carregar clientes'),
		});
	}

	setTab(tab: 'general' | 'address' | 'contacts' | 'manageClient') {
		this.selectedTab.set(tab);
	}

	editClient(client: ClientResponse) {
		this.selectedClient.set({
			...client,
			phones: [...client.phones],
		});
		this.clientAddresses.set(client.addresses.map(addr => ({
			...addr
		})));
		this.expandedAddresses.set(new Set());
	}

	toggleAddressExpansion(addressIndex: number) {
		const expanded = new Set(this.expandedAddresses());
		expanded.has(addressIndex) ? expanded.delete(addressIndex) : expanded.add(addressIndex);
		this.expandedAddresses.set(expanded);
	}

	isAddressExpanded(addressIndex: number): boolean {
		return this.expandedAddresses().has(addressIndex);
	}

	addAddress() {
		const addresses = this.clientAddresses();
		if (addresses.length >= 5) return;

		const newAddress: Address = {
			street: '',
			number: '',
			complement: '',
			neighborhood: '',
			city: '',
			state: '',
			postalCode: ''
		};

		this.clientAddresses.set([...addresses, newAddress]);

		const newIndex = addresses.length;
		const expanded = new Set(this.expandedAddresses());
		expanded.add(newIndex);
		this.expandedAddresses.set(expanded);
	}

	removeAddress(index: number) {
		const addresses = [...this.clientAddresses()];
		addresses.splice(index, 1);
		this.clientAddresses.set(addresses);

		const expanded = new Set(this.expandedAddresses());
		expanded.delete(index);

		const newExpanded = new Set<number>();
		expanded.forEach(i => {
			newExpanded.add(i > index ? i - 1 : i);
		});
		this.expandedAddresses.set(newExpanded);
	}

	isAreaCodeEnabled(index: number): boolean {
		const phoneState = this.phoneFieldsEnabled()?.[index];
		return phoneState ? phoneState.areaCode : false;
	}

	isNumberEnabled(index: number): boolean {
		const phoneState = this.phoneFieldsEnabled()?.[index];
		return phoneState ? phoneState.number : false;
	}

	addPhone() {
		const client = this.selectedClient();
		if (!client || client.phones.length >= 4) return;

		this.selectedClient.set({
			...client,
			phones: [...client.phones, { areaCode: '', number: '' }],
		});
	}

	removePhone(index: number) {
		const client = this.selectedClient();
		if (!client) return;

		const updatedPhones = [...client.phones];
		updatedPhones.splice(index, 1);

		this.selectedClient.set({
			...client,
			phones: updatedPhones,
		});
	}

	closeModal() {
		this.selectedClient.set(null);
		this.expandedAddresses.set(new Set());
		this.clientAddresses.set([]);
	}

	saveClient() {
		alert('Cliente salvo!');
		this.closeModal();
	}

	toggleNameField() {
		this.nameFieldEnabled.update(value => !value);
	}

	toggleEmailField() {
		this.emailFieldEnabled.update(value => !value);
	}

	toggleDocNumberField() {
		this.docNumberFieldEnabled.update(value => !value);
	}

	togglePhoneFields(index: number) {
		const current = this.phoneFieldsEnabled();
		const phoneState = current[index] ?? { areaCode: false, number: false };
		const updated = {
			...current,
			[index]: {
				areaCode: !phoneState.areaCode,
				number: !phoneState.number
			}
		};
		this.phoneFieldsEnabled.set(updated);
	}

}
