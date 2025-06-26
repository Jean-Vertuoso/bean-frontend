import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DefaultFormLayoutComponent } from '../../../components/default-form-layout/default-form-layout.component';
import { FormInputComponent } from '../../../components/form-input/form-input.component';
import { ProductService, ProductRequest } from '../../../services/product.service';
import { EditButtonComponent } from "../../../components/edit-button/edit-button.component";
import { FormUnityMeasureSelectComponent } from "../../../components/form-unity-measure-select/form-unity-measure-select.component";
import { FormPackagingTypeSelectComponent } from "../../../components/form-packaging-type-select/form-packaging-type-select.component";

@Component({
  standalone: true,
  selector: 'app-new-product',
  imports: [
    CommonModule,
    DefaultFormLayoutComponent,
    FormInputComponent,
    ReactiveFormsModule,
    EditButtonComponent,
    FormUnityMeasureSelectComponent,
    FormPackagingTypeSelectComponent
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
  });

  constructor(private productService: ProductService) {}

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  onSubmit() {
	console.log(this.form.value); // veja os valores
	console.log(this.form.valid); // veja se é false
	console.log(this.form.errors); // veja se há erros

    if (this.form.invalid) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const formValue = this.form.value;

    const rawPrice = formValue.price?.toString() ?? '';
    const formattedPrice = parseFloat(
      rawPrice.replace(/\./g, '').replace(',', '.')
    );

    const product: ProductRequest = {
      name: formValue.name ?? '',
      brand: formValue.brand ?? '',
      price: formattedPrice,
      barCode: formValue.barCode ?? '',
      imgUrl: formValue.imgUrl ?? '',
      packagingType: formValue.packagingType ?? '',
      unitOfMeasure: formValue.unitOfMeasure ?? '',
    };

    console.log('JSON enviado:', product);

    this.productService.register(product).subscribe({
      next: (res) => {
        console.log('Produto cadastrado:', res);
        alert('Produto cadastrado com sucesso!');
        this.form.reset();
      },
      error: (err) => {
        console.error('Erro ao cadastrar produto:', err);
        alert('Erro ao cadastrar produto');
      },
    });
  }
}
