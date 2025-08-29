import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientRequest, ClientResponse, ClientUpdateRequest } from '../../../shared/models/client.model';

@Injectable({
	providedIn: 'root'
})

export class ClientService {

	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:8080/clients';

	register(client: ClientRequest): Observable<object> {
		return this.http.post<object>(this.apiUrl, client);
	}

	getAll(): Observable<ClientResponse[]> {
		return this.http.get<ClientResponse[]>(this.apiUrl);
	}

	update(id: number, client: ClientUpdateRequest): Observable<any> {
		return this.http.put(`${this.apiUrl}/${id}`, client);
	}

	findByNameContaining(name: string): Observable<ClientResponse[]> {
		return this.http.get<ClientResponse[]>(`${this.apiUrl}?name=${encodeURIComponent(name)}`);
	}

}
