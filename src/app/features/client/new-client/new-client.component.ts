import { FormInputComponent } from '../../../shared/components/form/form-input/form-input.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DefaultFormLayoutComponent } from '../../../shared/components/layout/default-form-layout/default-form-layout.component';
import { ClientRequest } from '../../../shared/models/client.model';
import { FormUtilitySelectComponent } from "../../../shared/components/form/form-utility-select/form-utility-select.component";
import { ClientService } from '../services/client.service';

@Component({
	standalone: true,
	selector: 'app-new-client',
	imports: [
		CommonModule,
		DefaultFormLayoutComponent,
		FormUtilitySelectComponent,
		FormInputComponent,
		ReactiveFormsModule
	],
	templateUrl: './new-client.component.html',
	styleUrl: './new-client.component.scss',
})

export class NewClientComponent {

	ufs = [
		{ label: 'Acre', value: 'AC' },
		{ label: 'Alagoas', value: 'AL' },
		{ label: 'Amapá', value: 'AP' },
		{ label: 'Amazonas', value: 'AM' },
		{ label: 'Bahia', value: 'BA' },
		{ label: 'Ceará', value: 'CE' },
		{ label: 'Distrito Federal', value: 'DF' },
		{ label: 'Espírito Santo', value: 'ES' },
		{ label: 'Goiás', value: 'GO' },
		{ label: 'Maranhão', value: 'MA' },
		{ label: 'Mato Grosso', value: 'MT' },
		{ label: 'Mato Grosso do Sul', value: 'MS' },
		{ label: 'Minas Gerais', value: 'MG' },
		{ label: 'Pará', value: 'PA' },
		{ label: 'Paraíba', value: 'PB' },
		{ label: 'Paraná', value: 'PR' },
		{ label: 'Pernambuco', value: 'PE' },
		{ label: 'Piauí', value: 'PI' },
		{ label: 'Rio de Janeiro', value: 'RJ' },
		{ label: 'Rio Grande do Norte', value: 'RN' },
		{ label: 'Rio Grande do Sul', value: 'RS' },
		{ label: 'Rondônia', value: 'RO' },
		{ label: 'Roraima', value: 'RR' },
		{ label: 'Santa Catarina', value: 'SC' },
		{ label: 'São Paulo', value: 'SP' },
		{ label: 'Sergipe', value: 'SE' },
		{ label: 'Tocantins', value: 'TO' },
	];

	form = new FormGroup({
		name: new FormControl('', Validators.required),
		birthDate: new FormControl('', Validators.required),
		documentType: new FormControl('', Validators.required),
		documentNumber: new FormControl('', Validators.required),
		email: new FormControl('', [Validators.required, Validators.email]),

		areaCodePhone: new FormControl(''),
		mainPhone: new FormControl(''),
		areaCodeMobile: new FormControl(''),
		mainMobile: new FormControl(''),

		street: new FormControl('', Validators.required),
		number: new FormControl('', Validators.required),
		neighborhood: new FormControl('', Validators.required),
		city: new FormControl('', Validators.required),
		postalCode: new FormControl('', Validators.required),

		uf: new FormControl('', Validators.required)
	});

	constructor(private clientService: ClientService) {}

	onSubmit() {
		if (this.form.invalid) {
			alert('Preencha todos os campos obrigatórios!');
			return;
		}

		const formValue = this.form.value;

		const client: ClientRequest = {
			name: formValue.name ?? '',
			birthDate: formValue.birthDate ?? '',
			documentType: formValue.documentType ?? '',
			documentNumber: formValue.documentNumber ?? '',
			email: formValue.email ?? '',
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
					street: formValue.street ?? '',
					number: formValue.number ?? '',
					neighborhood: formValue.neighborhood ?? '',
					city: formValue.city ?? '',
					state: formValue.uf ?? '',
					postalCode: formValue.postalCode ?? '',
				},
			],
		};

		this.clientService.register(client).subscribe({
			next: (res) => {
				alert('Cliente cadastrado com sucesso!');
				this.form.reset();
			},
			error: (err) => {
				console.error('Erro ao cadastrar cliente:', err);
				alert('Erro ao cadastrar cliente');
			},
		});
	}
}
