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
import { ClienteService, ClienteRequest } from '../../../services/client.service';

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
  ufSelecionada = '';

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

  constructor(private clienteService: ClienteService) {}

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const formValue = this.form.value;

    const cliente: ClienteRequest = {
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
          state: this.ufSelecionada,
          postalCode: formValue.postalCode ?? '',
        },
      ],
    };

    console.log('JSON enviado:', cliente);

    this.clienteService.cadastrar(cliente).subscribe({
      next: (res) => {
        console.log('Cliente cadastrado:', res);
        alert('Cliente cadastrado com sucesso!');
        this.form.reset();
        this.ufSelecionada = '';
      },
      error: (err) => {
        console.error('Erro ao cadastrar cliente:', err);
        alert('Erro ao cadastrar cliente');
      },
    });
  }
}
