import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-button',
  imports: [],
  templateUrl: './navbar-button.component.html',
  styleUrl: './navbar-button.component.scss'
})
export class NavbarButtonComponent {
	@Input() label!: string;
	@Input() icon?: string;
	@Input() link!: string;
	@Input() src?: string;
}
