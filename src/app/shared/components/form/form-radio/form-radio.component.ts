import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';

@Component({
	selector: 'app-form-radio',
	imports: [],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormRadioComponent),
			multi: true
		}
	],
	templateUrl: './form-radio.component.html',
	styleUrl: './form-radio.component.scss'
})
export class FormRadioComponent implements ControlValueAccessor{

	@Input() name: string = '';
	@Input() value: string = '';
	@Input() disabled: boolean = false;
	@Input() inputText: string = '';
	@Input() label: string = '';
	protected currentValue: string = '';

	constructor() {

	}

	protected onChange: (val: any) => void = () => {

	};

    protected onTouched: () => void = () => {

	};

	writeValue(value: any): void {
		this.currentValue = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	onSelect(): void {
		this.onChange(this.value);
		this.onTouched();
	}
}
