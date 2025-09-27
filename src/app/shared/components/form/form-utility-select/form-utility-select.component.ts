import { Component,	ElementRef,	EventEmitter, forwardRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
	selector: 'app-form-utility-select',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule
	],
	templateUrl: './form-utility-select.component.html',
	styleUrls: ['./form-utility-select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormUtilitySelectComponent),
			multi: true
		}
	]
})
export class FormUtilitySelectComponent implements ControlValueAccessor {

	@Input() label: string = '';
	@Input() placeholder: string = '';
	@Input() options: { label: string; value: string }[] = [];
	@Input() multiple: boolean = false;
	@Input() value: string = '';
	protected currentValue: string = '';
	protected open = false;

	constructor() {

	}

	get displayLabel(): string {
		const selected = this.options.find(opt => opt.value === this.value);
		return selected?.label || this.placeholder;
	}

	protected onChange: (val: any) => void = () => {

	};

    protected onTouched: () => void = () => {

	};

	writeValue(value: string): void {
		this.currentValue = value ;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	isSelected(value: string): boolean {
		return this.value === value;
	}

	onSelect(value: string): void {
		this.value = value;
		this.currentValue = value;
		this.open = false;

		this.onChange(value);
		this.onTouched();
	}

	toggle() {
		this.open = !this.open;
	}
}
