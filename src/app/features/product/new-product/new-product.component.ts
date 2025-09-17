import { CommonModule } from '@angular/common';
import { Component, signal, effect } from '@angular/core';
import { provideNgxMask } from 'ngx-mask';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DefaultFormLayoutComponent } from '../../../shared/components/layout/default-form-layout/default-form-layout.component';
import { FormInputComponent } from '../../../shared/components/form/form-input/form-input.component';
import { ProductService } from '../services/product.service';
import { FormUtilityButtonComponent } from "../../../shared/components/form/form-utility-button/form-utility-button.component";
import { FormUtilitySelectComponent } from "../../../shared/components/form/form-utility-select/form-utility-select.component";
import Swal from 'sweetalert2';

@Component({
	standalone: true,
	selector: 'app-new-product',
	imports: [
		CommonModule,
		DefaultFormLayoutComponent,
		FormInputComponent,
		ReactiveFormsModule,
		FormUtilityButtonComponent,
		FormUtilitySelectComponent
	],
	providers: [
		provideNgxMask()
	],
	templateUrl: './new-product.component.html',
	styleUrl: './new-product.component.scss',
})
export class NewProductComponent {

	form = new FormGroup({
		name: new FormControl('', Validators.required),
		brand: new FormControl('', Validators.required),
		price: new FormControl('', Validators.required),
		barCode: new FormControl('', Validators.required),
		imgUrl: new FormControl(''),
		packagingType: new FormControl('', Validators.required),
		unitOfMeasure: new FormControl('', Validators.required),
		categoryIds: new FormControl([]),
		isUrl: new FormControl(true)
	});

	availableCategories = [
		{ label: 'Alimentos', value: 1},
		{ label: 'Ferramentas', value: 2},
		{ label: 'Fertilizantes', value: 3},
		{ label: 'Rações para,  aves', value: 4},
		{ label: 'Rações para,  cães', value: 5},
		{ label: 'Rações para,  equinos', value: 6},
		{ label: 'Rações para,  gatos', value: 7},
		{ label: 'Sementes', value: 8},
		{ label: 'Solúveis', value: 9}
	];

	measureUnities = [
		{ label: 'Centímetro', value: 'CENTIMETER' },
		{ label: 'Grama', value: 'GRAM' },
		{ label: 'Quilograma', value: 'KILOGRAM' },
		{ label: 'Litro', value: 'LITER' },
		{ label: 'Metro', value: 'METER' },
		{ label: 'Mililitro', value: 'MILLILITER' },
		{ label: 'Unidade', value: 'UNIT' },
	];

	packagingTypes = [
		{ label: 'Caixa', value: 'BOX' },
		{ label: 'Dúzia', value: 'DOZEN' },
		{ label: 'Frasco', value: 'BOTTLE' },
		{ label: 'Lata', value: 'CAN' },
		{ label: 'Pacote', value: 'PACKAGE' },
		{ label: 'Par', value: 'PAIR' },
		{ label: 'Saco', value: 'BAG' },
	];

	previewImage = signal<string | null>(null);

	constructor(private productService: ProductService) {
		effect(() => {
			const url = this.form.get('imgUrl')?.value ?? null;
			this.previewImage.set(url);
		});
	}

	getControl(controlName: string): FormControl {
		return this.form.get(controlName) as FormControl;
	}

	onCategoriesChange(ids: Set<number>) {
		this.getControl('categoryIds').setValue(Array.from(ids));
	}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];

		const maxSizeInMB = 2;
		const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

		if (file.size > maxSizeInBytes) {
			Swal.fire({
				icon: 'warning',
				title: 'Imagem muito grande',
				text: `A imagem deve ter no máximo ${maxSizeInMB}MB.`,
				confirmButtonColor: '#27ae60'
			});
			input.value = '';
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const base64 = reader.result as string;
			this.getControl('imgUrl').setValue(base64);
			this.getControl('isUrl').setValue(false);
			this.previewImage.set(base64);
		};
		reader.readAsDataURL(file);
	}

	clearImage() {
		this.getControl('imgUrl').setValue(null);
		this.getControl('isUrl').setValue(null);
		this.previewImage.set(null);

		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	onImageUrlChange() {
		const url = this.getControl('imgUrl').value;
		if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
			this.getControl('isUrl').setValue(true);
			this.previewImage.set(url);
		} else {
			this.getControl('isUrl').setValue(false);
		}
	}

	onSubmit() {
		if (this.form.invalid) {
			Swal.fire({
				icon: 'warning',
				title: 'Campos obrigatórios',
				text: 'Preencha todos os campos obrigatórios!',
				confirmButtonColor: '#27ae60'
			});
			return;
		}

		const formValue = this.form.value;
		const rawPrice = formValue.price?.toString() ?? '';
		const formattedPrice = parseFloat(rawPrice.replace(/\./g, '').replace(',', '.'));

		const baseProduct = {
			name: formValue.name ?? '',
			brand: formValue.brand ?? '',
			price: formattedPrice,
			barCode: formValue.barCode ?? '',
			packagingType: formValue.packagingType ?? '',
			unitOfMeasure: formValue.unitOfMeasure ?? '',
			categoryIds: formValue.categoryIds ?? []
		};

		if (formValue.isUrl) {
			const product = { ...baseProduct, imgUrl: formValue.imgUrl ?? '' };
			this.productService.register(product).subscribe({
				next: () => {
					Swal.fire({
						icon: 'success',
						title: 'Produto cadastrado!',
						text: 'O produto foi registrado com sucesso.',
						confirmButtonColor: '#27ae60'
					});
					this.form.reset();
					this.previewImage.set(null);
				},
				error: () => {
					Swal.fire({
						icon: 'error',
						title: 'Erro',
						text: 'Não foi possível cadastrar o produto.',
						confirmButtonColor: '#e74c3c'
					});
				}
			});
		} else {
			const formData = new FormData();
			formData.append('name', baseProduct.name);
			formData.append('brand', baseProduct.brand);
			formData.append('price', baseProduct.price.toString());
			formData.append('barCode', baseProduct.barCode);
			formData.append('packagingType', baseProduct.packagingType);
			formData.append('unitOfMeasure', baseProduct.unitOfMeasure);
			baseProduct.categoryIds.forEach((id: number) => formData.append('categoryIds', id.toString()));

			const blob = this.dataURItoBlob(formValue.imgUrl!);
			formData.append('image', blob, 'upload.png');

			this.productService.registerUpload(formData).subscribe({
				next: () => {
					Swal.fire({
						icon: 'success',
						title: 'Produto cadastrado!',
						text: 'O produto foi registrado com sucesso.',
						confirmButtonColor: '#27ae60'
					});
					this.form.reset();
					this.previewImage.set(null);
				},
				error: () => {
					Swal.fire({
						icon: 'error',
						title: 'Erro',
						text: 'Não foi possível cadastrar o produto.',
						confirmButtonColor: '#e74c3c'
					});
				}
			});
		}
	}

	dataURItoBlob(dataURI: string): Blob {
		const byteString = atob(dataURI.split(',')[1]);
		const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: mimeString });
	}
}
