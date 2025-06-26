import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

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

export interface ClientRequest {
  name: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phones: Phone[];
  addresses: Address[];
}

@Injectable({
	providedIn: 'root'
})

export class ClientService {

	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:8080/clients';

	register(client: ClientRequest): Observable<any> {
		return this.http.post<any>(this.apiUrl, client);
	}
}
