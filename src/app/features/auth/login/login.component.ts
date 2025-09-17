import { PrimaryInputComponent } from '../../../shared/components/form/primary-input/primary-input.component';
import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { DefaultLoginLayoutComponent } from "../../../shared/components/layout/default-login-layout/default-login-layout.component";
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		DefaultLoginLayoutComponent,
		PrimaryInputComponent,
		NgxSpinnerModule
	],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {

	loginForm = new FormGroup({
		email: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.email]
		}),
		password: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(8)]
		})
	});

	loginError = signal('');

	constructor(
		private authService: AuthService,
		private router: Router,
		private spinner: NgxSpinnerService
	) {}

	submit() {
		if (this.loginForm.invalid) {
			this.showError('Preencha todos os campos corretamente.');
			return;
		}

		const { email, password } = this.loginForm.getRawValue();
		this.loginError.set('');
		this.spinner.show();

		this.authService.login(email, password).subscribe({
			next: () => {
				setTimeout(() => {
					this.spinner.hide();
					Swal.fire({
						icon: 'success',
						title: 'Dados validados!',
						text: 'Acessando o sistema...',
						showConfirmButton: false,
						timer: 1200
					}).then(() => {
						this.router.navigate(['/home']);
					});
				}, 800);
			},
			error: () => {
				this.spinner.hide();
				this.showError('Email ou senha inválidos!');
			}
		});
	}

	private showError(message: string) {
		this.loginError.set(message);
		setTimeout(() => this.loginError.set(''), 3000);
	}

	onInputChange() {
		this.loginError.set('');
	}
}
