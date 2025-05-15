import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { DropdownComponent } from "../dropdown/dropdown.component";

@Component({
  selector: 'app-navbar-button',
  imports: [
	DropdownComponent,
	CommonModule
	],
  templateUrl: './navbar-button.component.html',
  styleUrl: './navbar-button.component.scss'
})
export class NavbarButtonComponent {

	constructor(private router: Router){}

	@Input() label!: string;
	@Input() src?: string;
	@Input() options: { label: string; href: string }[] = [];
	@Input() route!: string;

	open = false;

	toggleDropdown() {
		this.open = !this.open;
	}

	handleClick(){
		if (this.route) {
			this.router.navigate([this.route]);
		}
	}

	@ContentChild('dropdownContent', {static: true}) contentTpl!: TemplateRef<any>;
}
