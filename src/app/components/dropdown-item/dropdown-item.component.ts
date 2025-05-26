import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dropdown-item',
  imports: [
	RouterModule
  ],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.scss'
})
export class DropdownItemComponent {
	@Input() src!: string;
	@Input() label!: string;
	@Input() routerLink: string = "";
}
