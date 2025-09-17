import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Sale } from '../../../shared/models/sale.model';

@Injectable({
	providedIn: 'root'
})
export class SaleService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = 'http://localhost:8080/sales';

	public saveSale(sale: Sale): Observable<Sale> {
		return this.http.post<Sale>(this.baseUrl, sale).pipe(
			catchError(this.handleError)
		);
	}

	public findAllSales(): Observable<Sale[]> {
		return this.http.get<Sale[]>(this.baseUrl).pipe(
			catchError(this.handleError)
		);
	}
	public findSaleById(id: number): Observable<Sale> {
		return this.http.get<Sale>(`${this.baseUrl}/${id}`).pipe(
			catchError(this.handleError)
		);
	}
	private handleError(error: HttpErrorResponse) {
		let errorMsg = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

		if (error.error instanceof ErrorEvent) {
			errorMsg = `Erro do cliente: ${error.error.message}`;
		} else {
			if (error.status === 0) {
				errorMsg = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
			} else if (error.status >= 400 && error.status < 500) {
				errorMsg = error.error?.message || `Erro ${error.status}: Requisição inválida.`;
			} else if (error.status >= 500) {
				errorMsg = 'Erro interno no servidor. Entre em contato com o suporte.';
			}
		}

		console.error(`SaleService Error [${error.status}]:`, error);
		return throwError(() => new Error(errorMsg));
	}
}
