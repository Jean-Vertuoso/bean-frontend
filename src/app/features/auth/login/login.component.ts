import { PrimaryInputComponent } from '../../../shared/components/form/primary-input/primary-input.component';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DefaultLoginLayoutComponent } from "../../../shared/components/layout/default-login-layout/default-login-layout.component";

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		DefaultLoginLayoutComponent,
		PrimaryInputComponent
	],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent {

	private authService = inject(AuthService);
	private toastr = inject(ToastrService);
	private router = inject(Router);

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

	submit() {
		if (this.loginForm.invalid) {
			this.toastr.error('Preencha todos os campos corretamente.');
			return;
		}

		const { email, password } = this.loginForm.getRawValue();

		this.authService.login(email, password).subscribe({
			next: () => {
				this.toastr.success('Login efetuado com sucesso!');
				this.router.navigate(['/home']);
			},
			error: () => {
				this.toastr.error('Email ou senha inválidos!');
				this.loginForm.reset();
			}
		});
	}
}
