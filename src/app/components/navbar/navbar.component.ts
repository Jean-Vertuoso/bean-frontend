import { RouterModule } from '@angular/router';
import { Component, Input, TemplateRef } from '@angular/core';
import { NavbarButtonComponent } from "../navbar-button/navbar-button.component";
import { DropdownItemComponent } from "../dropdown-item/dropdown-item.component";

@Component({
  selector: 'app-navbar',
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

	toggleDropdown(id: string) {
	if (this.openDropdown === id) {
			this.openDropdown = null;
		} else {
			this.openDropdown = id;
		}
	}

	isOpen(id: string): boolean {
		return this.openDropdown === id;
	}
}
