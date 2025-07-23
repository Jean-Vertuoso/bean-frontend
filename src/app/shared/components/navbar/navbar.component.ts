import { RouterModule, Router } from '@angular/router';
import { Component, Input, TemplateRef } from '@angular/core';
import { NavbarButtonComponent } from "../buttons/navbar-button/navbar-button.component";
import { DropdownItemComponent } from "../dropdown/dropdown-item/dropdown-item.component";
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [
		NavbarButtonComponent,
		RouterModule,
		DropdownItemComponent
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
	@Input() contentTpl!: TemplateRef<any>;
	@Input() openDropdown: string | null = null;

	constructor(
		private authService: AuthService,
		private tokenService: TokenService,
		private router: Router,
		private toastr: ToastrService
	) {}

	toggleDropdown(id: string) {
		this.openDropdown = this.openDropdown === id ? null : id;
	}

	isOpen(id: string): boolean {
		return this.openDropdown === id;
	}

	logout() {
		this.authService.logout().subscribe({
			next: () => {
				this.tokenService.clearAuth();
				this.router.navigate(['/login']);
				this.toastr.success('Logout realizado com sucesso!');
			},
			error: () => {
				this.tokenService.clearAuth();
				this.router.navigate(['/login']);
				this.toastr.info('Sessão expirada. Faça login novamente.');
			}
		});
	}
}
