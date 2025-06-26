import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DefaultFormLayoutComponent } from '../../../components/default-form-layout/default-form-layout.component';
import { FormInputComponent } from '../../../components/form-input/form-input.component';
import { FormUfSelectComponent } from '../../../components/form-uf-select/form-uf-select.component';
import { ClientService, ClientRequest } from '../../../services/client.service';

@Component({
  standalone: true,
  selector: 'app-new-client',
  imports: [
    CommonModule,
    DefaultFormLayoutComponent,
    FormInputComponent,
    FormUfSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss',
})
export class NewClientComponent {
  ufSelected = '';

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
  });

  constructor(private clientService: ClientService) {}

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

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
          state: this.ufSelected,
          postalCode: formValue.postalCode ?? '',
        },
      ],
    };

    console.log('JSON enviado:', client);

    this.clientService.register(client).subscribe({
      next: (res) => {
        console.log('Cliente cadastrado:', res);
        alert('Cliente cadastrado com sucesso!');
        this.form.reset();
        this.ufSelected = '';
      },
      error: (err) => {
        console.error('Erro ao cadastrar cliente:', err);
        alert('Erro ao cadastrar cliente');
      },
    });
  }
}
