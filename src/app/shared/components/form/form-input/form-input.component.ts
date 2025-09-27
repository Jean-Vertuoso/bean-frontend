import { Component, forwardRef, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-form-input',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [
		{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormInputComponent),
            multi: true
        }],
	templateUrl: './form-input.component.html',
	styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements ControlValueAccessor{

	@Input() label: string = '';
	@Input() placeholder: string = '';
	@Input() inputText: string = '';
	@Input() value: string = '';
	@Input() name: string = '';
	@Input() width: number = 200;
	@Input() disabled: boolean = false;

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

	handleInput(event: Event): void {
		const inputValue = (event.target as HTMLInputElement).value;
		this.value = inputValue;
		this.onChange(inputValue);
	}
}
