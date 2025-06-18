import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Cliente {
	id?: number;
	nome: string;
	email: string;
	cpf: string;
	telefone: string;
}

@Injectable({
	providedIn: 'root'
})

export class ClienteService {

	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:8080/clients';

	cadastrar(cliente: Cliente): Observable<Cliente> {
		return this.http.post<Cliente>(this.apiUrl, cliente);
	}
}
