import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, ProductResponse } from '../services/product.service';

@Component({
	standalone: true,
	selector: 'app-find-product',
	templateUrl: './find-product.component.html',
	styleUrls: ['./find-product.component.scss'],
	imports: [CommonModule],
})
export class FindProductComponent {
	products = signal<ProductResponse[]>([]);
	selectedProduct: ProductResponse | null = null;
	searchTerm = signal<string>('');

	// Computed para filtrar produtos conforme searchTerm
	filteredProducts = computed(() => {
		const term = this.searchTerm().toLowerCase();
		if (!term) return this.products();
		return this.products().filter(p =>
			p.name.toLowerCase().includes(term) ||
			p.brand.toLowerCase().includes(term)
		);
	});

	constructor(private productService: ProductService) {
		this.loadProducts();
	}

	loadProducts() {
		this.productService.getAll().subscribe({
			next: (data) => this.products.set(data),
			error: () => alert('Erro ao carregar produtos'),
		});
	}

	openDetails(product: ProductResponse) {
		this.selectedProduct = product;
	}

	closeDetails() {
		this.selectedProduct = null;
	}

	addToSale(product: ProductResponse) {
		alert(`Produto "${product.name}" adicionado à venda!`);
	}
}
