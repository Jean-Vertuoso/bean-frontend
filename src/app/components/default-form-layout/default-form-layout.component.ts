import { Component, Input } from '@angular/core';
import { FormInputComponent } from "../form-input/form-input.component";

@Component({
	selector: 'app-default-form-layout',
	imports: [],
	templateUrl: './default-form-layout.component.html',
	styleUrl: './default-form-layout.component.scss'
})
export class DefaultFormLayoutComponent {
	@Input() formControlName: string = '';
	@Input() title: string = '';

	submit() {
		throw new Error('Method not implemented.');
	}
}
