import { Component,	ElementRef,	EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-form-utility-select',
	standalone: true,
	imports: [CommonModule],
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

	@Input() label: string = 'Campo';
	@Input() placeholder: string = 'Selecione';
	@Input() options: { label: string; value: string | number }[] = [];
	@Input() multiple: boolean = false;

	@Output() modelChange = new EventEmitter<any>();

	value: any = this.multiple ? [] : null;
	open = false;

	onChange = (_: any) => {};
	onTouched = () => {};

	constructor(private elementRef: ElementRef) {}

	writeValue(obj: any): void {
		this.value = obj ?? (this.multiple ? [] : null);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		// implementar
	}

	get displayLabel(): string {
		if (this.multiple) {
			const selected = this.options.filter(opt => this.isSelected(opt.value));
			return selected.length ? selected.map(opt => opt.label).join(', ') : this.placeholder;
		}
		const selected = this.options.find(opt => opt.value === this.value);
		return selected?.label || this.placeholder;
	}

	isSelected(value: any): boolean {
		if (this.multiple) {
			return Array.isArray(this.value) && this.value.includes(value);
		}
		return this.value === value;
	}

	onSelect(value: any) {
		if (this.multiple) {
			const current = new Set(this.value || []);
			current.has(value) ? current.delete(value) : current.add(value);
			this.value = Array.from(current);
		} else {
			this.value = value;
			this.open = false;
		}
		this.onChange(this.value);
		this.modelChange.emit(this.value);
	}

	toggle() {
		this.open = !this.open;
	}

	@HostListener('document:click', ['$event.target'])
	onClick(targetElement: any) {
		const clickedInside = this.elementRef.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.open = false;
			this.onTouched();
		}
	}
}
