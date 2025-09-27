import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, forwardRef } from '@angular/core';

@Component({
	selector: 'app-form-date',
	imports: [],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormDateComponent),
			multi: true
		}
	],
	templateUrl: './form-date.component.html',
	styleUrl: './form-date.component.scss'
})
export class FormDateComponent implements ControlValueAccessor{

	@Input() label: string = '';
	@Input() name: string = '';
	@Input() value: string = '';

    protected onChange: (val: any) => void = () => {

	};

    protected onTouched: () => void = () => {

	};

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

	setDisabledState?(isDisabled: boolean): void {
		isDisabled = false;
	}

	handleInput(event: Event): void {
		const inputValue = (event.target as HTMLInputElement).value;
		this.value = inputValue;
		this.onChange(inputValue);
	}
}
