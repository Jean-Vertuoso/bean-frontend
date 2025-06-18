import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-form-input',
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	templateUrl: './form-input.component.html',
	styleUrl: './form-input.component.scss'
})
export class FormInputComponent {
	@Input() control: FormControl = new FormControl('');
	@Input() labelText: string = '';
	@Input() labelRadio: string = '';
	@Input() type: string = '';
	@Input() placeholder: string = '';
	@Input() inputText: string = '';
	@Input() growone: boolean = false;
	@Input() growtwo: boolean = false;
	@Input() growthree: boolean = false;
	@Input() growfour: boolean = false;
	@Input() name: string = '';
	@Input() value: string = '';

	onChange(event: Event) {
		const target = event.target as HTMLInputElement;
		this.control.setValue(target.value);
	}

}
