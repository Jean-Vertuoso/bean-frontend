import { Component, forwardRef, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
	selector: 'app-form-input',
	standalone: true,
	imports: [
		CommonModule,
		NgxMaskDirective
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormInputComponent),
			multi: true
		},
		provideNgxMask()
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
	@Input() disabled: boolean = false;
	@Input() autocomplete: string = 'new-password';
	@Input() mask?: string;
	@Input() thousandSeparator: string = '.';
	@Input() decimalMarker: '.' | ',' | ['.', ','] = ',';
	@Input() prefix: string = '';
	@Input() dropSpecialCharacters: boolean = false;
	@Input() radioValue?: string;

	innerValue: string = '';
	private _numericValue: number = 0;

	@Input()
	set value(val: string | number) {
		if (val === null || val === undefined) {
			this.innerValue = this.isNumericField() ? '0,00' : '';
			this._numericValue = 0;
		} else if (typeof val === 'number') {
			this._numericValue = val;
			this.innerValue = this.isNumericField() ? val.toFixed(2).replace('.', ',') : val.toString();
		} else {
			this.innerValue = val;
			this._numericValue = this.isNumericField() ? parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0 : 0;
		}
	}

	get value(): string | number {
		return this.innerValue;
	}

	get numericValue(): number {
		return this._numericValue;
	}

	@Output() valueChange = new EventEmitter<any>();
	@Output() inputEvent = new EventEmitter<string>();
	@Output() focusEvent = new EventEmitter<FocusEvent>();
	@Output() blurEvent = new EventEmitter<FocusEvent>();
	@Output() keydownEvent = new EventEmitter<KeyboardEvent>();

	@ViewChild('inputEl', { static: false }) inputEl?: ElementRef<HTMLInputElement>;

	onChange: (value: any) => void = () => {};
	onTouched: () => void = () => {};

	writeValue(value: any): void {
		if (value === null || value === undefined) {
			this.innerValue = this.isNumericField() ? '0,00' : '';
			this._numericValue = 0;
		} else {
			this.innerValue = value;
			this._numericValue = this.isNumericField() ? parseFloat(value.toString().replace(/\./g, '').replace(',', '.')) || 0 : 0;
		}
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
		const val = target.value;

		this.innerValue = val;

		if (this.isNumericField()) {
			this._numericValue = parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0;
		}

		this.onChange(val);
		this.valueChange.emit(val);
		this.inputEvent.emit(val);
		this.onTouched();
	}

	onRadioChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		const val = this.radioValue ?? target.value;
		this.innerValue = val;
		this.onChange(val);
		this.valueChange.emit(val);
		this.onTouched();
	}

	isChecked(): boolean {
		return this.innerValue === this.radioValue;
	}

	onFocus(event?: FocusEvent): void {
		this.focusEvent.emit(event ?? new FocusEvent('focus'));
		Promise.resolve().then(() => {
			this.inputEl?.nativeElement.select();
		});
	}

	onBlur(event?: FocusEvent): void {
		if (this.isNumericField() && this.innerValue) {
			const cleaned = this.innerValue.replace(/[^\d,]/g, '');
			const numberValue = parseFloat(cleaned.replace(',', '.')) || 0;
			this.innerValue = numberValue.toFixed(2).replace('.', ',');
			this._numericValue = numberValue;
		}
		this.blurEvent.emit(event ?? new FocusEvent('blur'));
		this.onTouched();
	}

	onKeydown(event: KeyboardEvent): void {
		this.keydownEvent.emit(event);
	}

	focus(): void {
		this.inputEl?.nativeElement.focus();
	}

	private isNumericField(): boolean {
		return this.type === 'number' || !!this.mask;
	}
}
