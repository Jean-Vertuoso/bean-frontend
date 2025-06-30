import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-utility-button',
  imports: [],
  templateUrl: './form-utility-button.component.html',
  styleUrl: './form-utility-button.component.scss'
})
export class FormUtilityButtonComponent {
	@Input() src: string = '';
	@Input() class: string = '';
}
