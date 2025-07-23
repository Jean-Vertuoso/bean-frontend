import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
	@Input({ required: true }) contentTpl!: TemplateRef<any>;
}
