import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-form-input',
	standalone: true,
	imports: [CommonModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormInputComponent),
			multi: true
		}
	],
	templateUrl: './form-input.component.html',
	styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements ControlValueAccessor {
	@Input() labelText: string = '';
	@Input() labelRadio: string = '';
	@Input() type: string = 'text';
	@Input() placeholder: string = '';
	@Input() inputText: string = '';
	@Input() growone: boolean = false;
	@Input() growtwo: boolean = false;
	@Input() growthree: boolean = false;
	@Input() growfour: boolean = false;
	@Input() name: string = '';
	@Input() value: any = '';

	innerValue: any = '';
	disabled: boolean = false;

	onChange: (value: any) => void = () => {};
	onTouched: () => void = () => {};

	writeValue(value: any): void {
		this.innerValue = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	onInputChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.innerValue = target.value;
		this.onChange(this.innerValue);
		this.onTouched();
	}

	onRadioChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.innerValue = target.value;
		this.onChange(this.innerValue);
		this.onTouched();
	}

	isChecked(): boolean {
		return this.innerValue === this.value;
	}
}
