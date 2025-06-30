import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductRequest {
	name: string;
	brand: string;
	price: number;
	barCode: string;
	imgUrl: string | null;
	packagingType: string;
	unitOfMeasure: string;
	categoryIds: number[];
}

@Injectable({
	providedIn: 'root'
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
}
