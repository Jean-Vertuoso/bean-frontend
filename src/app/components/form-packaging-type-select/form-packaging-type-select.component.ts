import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'app-form-packaging-type-select',
	imports: [
		CommonModule,
		FormsModule
	],
	templateUrl: './form-packaging-type-select.component.html',
	styleUrl: './form-packaging-type-select.component.scss'
})
export class FormPackagingTypeSelectComponent {
	@Input() model: string = '';
	@Input() control!: FormControl;
  	@Output() modelChange = new EventEmitter<any>();

	open = false;

	packagingTypes = [
		{ name: 'Caixa', value: 'BOX' },
		{ name: 'Dúzia', value: 'DOZEN' },
		{ name: 'Frasco', value: 'BOTTLE' },
		{ name: 'Lata', value: 'CAN' },
		{ name: 'Pacote', value: 'PACKAGE' },
		{ name: 'Par', value: 'PAIR' },
		{ name: 'Saco', value: 'BAG' },
	];

	get packagingTypeSelected(): string {
		const packagingType = this.packagingTypes.find(packagingType => packagingType.value === this.control.value);
		return packagingType ? packagingType.name : 'Selecione';
  	}

	toggle() {
		this.open = !this.open;
	}

	packageSelect(packagingTypeName: string) {
		this.model = packagingTypeName;
		this.control.setValue(
			this.packagingTypes.find(mu => mu.name === packagingTypeName)?.value ?? ''
		);
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
