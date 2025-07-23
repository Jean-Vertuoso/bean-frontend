export interface ClientRequest {
	name: string;
	birthDate: string;
	documentType: string;
	documentNumber: string;
	email: string;
	phones: Phone[];
	addresses: Address[];
}

export interface ClientResponse {
	id: number;
	name: string;
	birthDate: string;
	documentType: string;
	documentNumber: string;
	email: string;
	phones: Phone[];
	addresses: Address[];
}

export interface ClientUpdateRequest extends Partial<ClientRequest> {}

export interface Phone {
	areaCode: string;
	number: string;
}

export interface Address {
	street: string;
	number: string;
	neighborhood: string;
	city: string;
	state: string;
	postalCode: string;
}
