import { CommonModule } from '@angular/common';
import { Component, signal, effect } from '@angular/core';
import { provideNgxMask } from 'ngx-mask';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DefaultFormLayoutComponent } from '../../../components/default-form-layout/default-form-layout.component';
import { FormInputComponent } from '../../../components/form-input/form-input.component';
import { ProductService, ProductRequest } from '../../../services/product.service';
import { FormUtilityButtonComponent } from "../../../components/form-utility-button/form-utility-button.component";
import { FormUnityMeasureSelectComponent } from "../../../components/form-unity-measure-select/form-unity-measure-select.component";
import { FormPackagingTypeSelectComponent } from "../../../components/form-packaging-type-select/form-packaging-type-select.component";
import { FormCategorySelectComponent } from '../../../components/form-category-select/form-category-select.component';

@Component({
	standalone: true,
	selector: 'app-new-product',
	imports: [
		CommonModule,
		DefaultFormLayoutComponent,
		FormInputComponent,
		ReactiveFormsModule,
		FormUtilityButtonComponent,
		FormUnityMeasureSelectComponent,
		FormPackagingTypeSelectComponent,
		FormCategorySelectComponent
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
		{ id: 1, name: 'Alimentos' },
		{ id: 2, name: 'Ferramentas' },
		{ id: 3, name: 'Fertilizantes' },
		{ id: 4, name: 'Rações para aves' },
		{ id: 5, name: 'Rações para cães' },
		{ id: 6, name: 'Rações para equinos' },
		{ id: 7, name: 'Rações para gatos' },
		{ id: 8, name: 'Sementes' },
		{ id: 9, name: 'Solúveis' }
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
			alert(`A imagem deve ter no máximo ${maxSizeInMB}MB.`);
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
			alert('Preencha todos os campos obrigatórios!');
			return;
		}

		const formValue = this.form.value;

		const rawPrice = formValue.price?.toString() ?? '';
		const formattedPrice = parseFloat(
			rawPrice.replace(/\./g, '').replace(',', '.')
		);

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
			const product = {
				...baseProduct,
				imgUrl: formValue.imgUrl ?? ''
			};
			this.productService.register(product).subscribe({
				next: (res) => {
					alert('Produto cadastrado com sucesso!');
					this.form.reset();
					this.previewImage.set(null);
				},
				error: (err) => {
					alert('Erro ao cadastrar produto');
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
			baseProduct.categoryIds.forEach((id: number) => {
				formData.append('categoryIds', id.toString());
			});

			const blob = this.dataURItoBlob(formValue.imgUrl!);
			formData.append('image', blob, 'upload.png');

			this.productService.registerUpload(formData).subscribe({
				next: () => {
					alert('Produto cadastrado com sucesso!');
					this.form.reset();
					this.previewImage.set(null);
				},
				error: () => {
					alert('Erro ao cadastrar produto');
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
