import { UF_OPTIONS } from './../../../shared/enums/uf.enum';
import { FormInputComponent } from '../../../shared/components/form/form-input/form-input.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DefaultFormLayoutComponent } from '../../../shared/components/layout/default-form-layout/default-form-layout.component';
import { ClientRequest } from '../../../shared/models/client.model';
import { FormUtilitySelectComponent } from "../../../shared/components/form/form-utility-select/form-utility-select.component";
import { ClientService } from '../services/client.service';
import Swal from 'sweetalert2';
import { FormRadioComponent } from "../../../shared/components/form/form-radio/form-radio.component";
import { FormDateComponent } from "../../../shared/components/form/form-date/form-date.component";

@Component({
	standalone: true,
	selector: 'app-new-client',
	imports: [
		CommonModule,
		DefaultFormLayoutComponent,
		FormUtilitySelectComponent,
		FormInputComponent,
		ReactiveFormsModule,
		FormRadioComponent,
		FormDateComponent,
	],
	templateUrl: './new-client.component.html',
	styleUrl: './new-client.component.scss',
})
export class NewClientComponent {

	form: FormGroup;
	ufOptions = UF_OPTIONS;

	constructor(private clientService: ClientService, private fb: FormBuilder) {
		this.form = this.fb.group({
			name: ['', { validators: Validators.required, nonNullable: true } ],
			birthDate: ['', { validators: Validators.required, nonNullable: true } ],
			documentType: ['', { validators: Validators.required, nonNullable: true } ],
			documentNumber: ['', { validators: Validators.required, nonNullable: true } ],
			email: ['', { validators: [Validators.required, Validators.email], nonNullable: true } ],
			areaCodePhone: [''],
			mainPhone: [''],
			areaCodeMobile: [''],
			mainMobile: [''],
			street: ['', { validators: Validators.required, nonNullable: true } ],
			number: ['', { validators: Validators.required, nonNullable: true } ],
			complement: [''],
			neighborhood: ['', { validators: Validators.required, nonNullable: true } ],
			city: ['', { validators: Validators.required, nonNullable: true } ],
			postalCode: ['', { validators: Validators.required, nonNullable: true } ],
			uf: ['', { validators: Validators.required, nonNullable: true } ]
		});
	}

	onSubmit() {
		const formValue = this.form.value;
		console.log(`Valores do formulário: `, this.form.value);

		if (this.form.invalid) {
			Swal.fire({
				icon: 'warning',
				title: 'Campos obrigatórios',
				text: 'Preencha todos os campos obrigatórios!',
				confirmButtonColor: '#27ae60'
			});
			return;
		}

		const client: ClientRequest = {
			name: formValue.name,
			birthDate: formValue.birthDate,
			documentType: formValue.documentType,
			documentNumber: formValue.documentNumber,
			email: formValue.email,
			phones: [
				{
					areaCode: formValue.areaCodePhone ?? '',
					number: formValue.mainPhone ?? '',
				},
				{
					areaCode: formValue.areaCodeMobile ?? '',
					number: formValue.mainMobile ?? '',
				},
			].filter((phone) => phone.areaCode && phone.number),
			addresses: [
				{
					street: formValue.street,
					number: formValue.number,
					complement: formValue.complement,
					neighborhood: formValue.neighborhood,
					city: formValue.city,
					state: formValue.uf,
					postalCode: formValue.postalCode,
				},
			],
		};

		this.clientService.register(client).subscribe({
			next: () => {
				Swal.fire({
					icon: 'success',
					title: 'Cliente cadastrado!',
					text: 'O cliente foi registrado com sucesso.',
					confirmButtonColor: '#27ae60'
				});
				this.form.reset();
			},
			error: (err) => {
				console.error('Erro ao cadastrar cliente:', err);
				Swal.fire({
					icon: 'error',
					title: 'Erro',
					text: 'Não foi possível cadastrar o cliente.',
					confirmButtonColor: '#e74c3c'
				});
			},
		});
	}
}
