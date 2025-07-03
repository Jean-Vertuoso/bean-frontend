import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'app-form-utility-select',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule
	],
	templateUrl: './form-utility-select.component.html',
	styleUrl: './form-utility-select.component.scss'
})
export class FormUtilitySelectComponent {
	@Input() label: string = 'Selecione';
	@Input() options: { label: string; value: string | number }[] = [];
	@Input() control?: FormControl;
	@Input() model?: string | number | Set<number>; // para [(model)]
	@Input() multiple: boolean = false;
	@Output() modelChange = new EventEmitter<any>();

	open = false;

	get displayLabel(): string {
	if (this.multiple && this.control) {
			const selected = this.options.filter(opt => (this.selectedSet?.has(opt.value)));
			return selected.length ? selected.map(opt => opt.label).join(', ') : 'Selecione';
		}

		const selected = this.options.find(opt =>
			this.control ? opt.value === this.control.value : opt.value === this.model
		);
		return selected?.label || 'Selecione';
	}

	get selectedSet(): Set<string | number> {
		if (!this.control) return new Set<string | number>();

		const values = this.control.value;

		if (!Array.isArray(values)) {
			return new Set<string | number>();
		}

		return new Set<string | number>(values);
	}



	toggle() {
		this.open = !this.open;
	}

	onSelect(value: any) {
		if (this.multiple) {
			const current = new Set(this.control?.value || []);
			current.has(value) ? current.delete(value) : current.add(value);
			this.control?.setValue(Array.from(current));
			this.modelChange.emit(current);
		} else {
			if (this.control) this.control.setValue(value);
			else this.model = value;

			this.modelChange.emit(value);
			this.open = false;
		}
	}

	isSelected(value: any): boolean {
		if (this.multiple) {
			return this.selectedSet.has(value);
		}
			return this.control ? this.control.value === value : this.model === value;
	}

	constructor(private elementRef: ElementRef) {}

	@HostListener('document:click', ['$event.target'])
	onClick(targetElement: any) {
		const clickedInside = this.elementRef.nativeElement.contains(targetElement);
		if (!clickedInside) this.open = false;
	}
}
