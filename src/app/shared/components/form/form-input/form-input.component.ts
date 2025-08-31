import { Component,	forwardRef,	Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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
	@Input() disabled: boolean = false;
	@Input() autocomplete: string = 'new-password';
	@Output() valueChange = new EventEmitter<any>();
	@ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

	innerValue: any = '';

	onChange: (value: any) => void = () => {};
	onTouched: () => void = () => {};

	writeValue(value: any): void {
		if (typeof value === 'number' && this.type === 'number') {
			this.innerValue = value.toFixed(2);
		} else {
			this.innerValue = value;
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

		let emitValue: any = val;

		if (this.type === 'number') {
			const normalized = val.replace(',', '.');
			const parsed = parseFloat(normalized);
			emitValue = isNaN(parsed) ? null : parsed;
		}

		this.onChange(emitValue);
		this.valueChange.emit(emitValue);
		this.onTouched();
	}

	onRadioChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.innerValue = target.value;
		this.onChange(this.innerValue);
		this.valueChange.emit(this.innerValue);
		this.onTouched();
	}

	isChecked(): boolean {
		return this.innerValue === this.value;
	}

	onFocus(): void {
		if (this.inputEl) {
			this.inputEl.nativeElement.select();
		}
	}

	focus(): void {
		if (this.inputEl) {
			this.inputEl.nativeElement.blur();
			setTimeout(() => {
				this.inputEl.nativeElement.focus();
			}, 0);
		}
	}
}
