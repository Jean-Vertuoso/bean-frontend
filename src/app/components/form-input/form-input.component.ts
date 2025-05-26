import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-form-input',
	imports: [
		CommonModule
	],
	templateUrl: './form-input.component.html',
	styleUrl: './form-input.component.scss'
})
export class FormInputComponent {
	@Input() labelText: string = '';
	@Input() labelRadio: string = '';
	@Input() control!: FormControl;
	@Input() type: string = 'text';
	@Input() placeholder: string = '';
	@Input() formControlName: string = '';
	@Input() inputText: string = '';
	@Input() growone: boolean = false;
	@Input() growtwo: boolean = false;
	@Input() inputDocType: string = '';
}
