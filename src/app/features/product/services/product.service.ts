import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRequest, ProductResponse } from '../../../shared/models/product.model';

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:8080/products';

	register(product: ProductRequest): Observable<any> {
		return this.http.post<any>(this.apiUrl, product);
	}

	registerUpload(formData: FormData): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/upload`, formData);
	}

	getAll(): Observable<ProductResponse[]> {
		return this.http.get<ProductResponse[]>(this.apiUrl);
	}
}
