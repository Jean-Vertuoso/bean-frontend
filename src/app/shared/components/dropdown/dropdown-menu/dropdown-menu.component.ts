import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
	selector: 'app-dropdown-menu',
	imports: [CommonModule],
	standalone: true,
	templateUrl: './dropdown-menu.component.html',
	styleUrl: './dropdown-menu.component.scss'
})
export class DropdownMenuComponent {
	@Input({ required: true }) contentTpl!: TemplateRef<any>;
}
