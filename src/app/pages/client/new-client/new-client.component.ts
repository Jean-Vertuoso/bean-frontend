import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { DefaultFormLayoutComponent } from "../../../components/default-form-layout/default-form-layout.component";
import { FormInputComponent } from "../../../components/form-input/form-input.component";
import { FormUfSelectComponent } from "../../../components/form-uf-select/form-uf-select.component";

@Component({
	standalone: true,
	selector: 'app-new-client',
	imports: [
		CommonModule,
		DefaultFormLayoutComponent,
		FormInputComponent,
		FormUfSelectComponent,
		ReactiveFormsModule
	],
	templateUrl: './new-client.component.html',
	styleUrl: './new-client.component.scss'
})
export class NewClientComponent {
	ufSelecionada = '';

	cliente: Object = {
		endereco: {
			uf: ''
		}
	};

	form = new FormGroup({
		name: new FormControl(''),
		birthDate: new FormControl(''),
		docType: new FormControl(''),
		documentNumber: new FormControl(''),
		email: new FormControl(''),
		areaCodePhone: new FormControl(''),
		mainPhone: new FormControl(''),
		areaCodeMobile: new FormControl(''),
		mainMobile: new FormControl(''),
		postalCode: new FormControl(''),
		street: new FormControl(''),
		number: new FormControl(''),
		neighborhood: new FormControl(''),
		city: new FormControl(''),
	});

	getControl(controlName: string): FormControl{
		return this.form.get(controlName) as FormControl;
	}

	onSubmit(){
		console.log('Form-data:', this.form.value);
	}
}
