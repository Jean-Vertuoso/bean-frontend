import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'app-form-unity-measure-select',
	imports: [
		CommonModule,
		FormsModule
	],
	templateUrl: './form-unity-measure-select.component.html',
	styleUrl: './form-unity-measure-select.component.scss'
})
export class FormUnityMeasureSelectComponent {
	@Input() model: string = '';
	@Input() control!: FormControl;
  	@Output() modelChange = new EventEmitter<any>();

	open = false;

	measureUnities = [
		{ name: 'Centímetro', value: 'CENTIMETER' },
		{ name: 'Grama', value: 'GRAM' },
		{ name: 'Quilograma', value: 'KILOGRAM' },
		{ name: 'Litro', value: 'LITER' },
		{ name: 'Metro', value: 'METER' },
		{ name: 'Mililitro', value: 'MILLILITER' },
		{ name: 'Unidade', value: 'UNIT' },
	];

	get unityNameSelected(): string {
		const measureUnity = this.measureUnities.find(mu => mu.value === this.control.value);
		return measureUnity ? measureUnity.name : 'Selecione';
	}


	toggle() {
		this.open = !this.open;
	}

	unitySelect(measureUnityName: string) {
		this.model = measureUnityName;
		this.control.setValue(
			this.measureUnities.find(mu => mu.name === measureUnityName)?.value ?? ''
		);
		this.modelChange.emit(measureUnityName);
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
