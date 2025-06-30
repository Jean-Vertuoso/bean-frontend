import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'app-form-category-select',
	imports: [
		CommonModule,
		FormsModule
	],
	templateUrl: './form-category-select.component.html',
	styleUrl: './form-category-select.component.scss'
})
export class FormCategorySelectComponent {
	@Input() control!: FormControl;
	@Input() categories: { id: number; name: string }[] = [];
	@Output() selectedIdsChange = new EventEmitter<Set<number>>();

	open = false;

	get selectedIds(): Set<number> {
		const values = this.control.value as number[] || [];
		return new Set(values);
	}

	toggle() {
		this.open = !this.open;
	}

	toggleSelection(categoryId: number) {
		const current = new Set(this.control.value as number[] || []);

		if (current.has(categoryId)) {
			current.delete(categoryId);
		} else {
			current.add(categoryId);
		}

		this.control.setValue(Array.from(current));
		this.selectedIdsChange.emit(current);
	}

	isSelected(id: number): boolean {
		return this.selectedIds.has(id);
	}

	get selectedNames(): string {
		const selected = this.categories.filter(cat => this.selectedIds.has(cat.id));
		return selected.length ? selected.map(cat => cat.name).join(', ') : 'Selecione';
	}

	constructor(private elementRef: ElementRef) {}

	@HostListener('document:click', ['$event.target'])
	onClick(targetElement: any) {
		const clickedInside = this.elementRef.nativeElement.contains(targetElement);

		if (!clickedInside) {
			this.open = false;
		}
	}
}
