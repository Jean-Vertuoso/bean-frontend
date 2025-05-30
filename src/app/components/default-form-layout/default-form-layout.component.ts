import { NewClientComponent } from './../../pages/client/new-client/new-client.component';
import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';
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
	@Output() submitClicked = new EventEmitter<void>();

	onSubmitClick() {
		this.submitClicked.emit();
	}
}
