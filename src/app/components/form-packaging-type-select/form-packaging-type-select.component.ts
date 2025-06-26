import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-form-packaging-type-select',
  imports: [],
  templateUrl: './form-packaging-type-select.component.html',
  styleUrl: './form-packaging-type-select.component.scss'
})
export class FormPackagingTypeSelectComponent {
	@Input() model: string = '';
  	@Output() modelChange = new EventEmitter<any>();

	open = false;

	packagingTypes = [
		{ name: 'Caixa', abreviacao: 'cm' },
		{ name: 'Grama', abreviacao: 'g' },
		{ name: 'Quilograma', abreviacao: 'Kg' },
		{ name: 'Litro', abreviacao: 'L' },
		{ name: 'Metro', abreviacao: 'M' },
		{ name: 'Mililitro', abreviacao: 'ml' },
		{ name: 'Unidade', abreviacao: 'un' },
	];

	get packagingNameSelected(): string {
    	const packagingType = this.packagingTypes.find(packagingType => packagingType.name === this.model);
    	return packagingType ? packagingType.name : 'Selecione';
  	}

	toggle() {
		this.open = !this.open;
	}

	selectPackage(packagingTypeName: string) {
		this.model = packagingTypeName;
		this.modelChange.emit(packagingTypeName);
		this.open = false;
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
