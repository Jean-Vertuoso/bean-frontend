import { Component } from '@angular/core';
import { DefaultFormLayoutComponent } from "../../../components/default-form-layout/default-form-layout.component";
import { FormInputComponent } from "../../../components/form-input/form-input.component";

@Component({
	selector: 'app-new-client',
	imports: [
		DefaultFormLayoutComponent,
		FormInputComponent],
	templateUrl: './new-client.component.html',
	styleUrl: './new-client.component.scss'
})
export class NewClientComponent {
	formControlName: any;
}
