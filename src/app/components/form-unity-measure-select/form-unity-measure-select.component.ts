import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  	@Output() modelChange = new EventEmitter<any>();

	open = false;

	unidadesMedida = [
		{ nome: 'Centímetro', abreviacao: 'cm' },
		{ nome: 'Grama', abreviacao: 'g' },
		{ nome: 'Quilograma', abreviacao: 'Kg' },
		{ nome: 'Litro', abreviacao: 'L' },
		{ nome: 'Metro', abreviacao: 'M' },
		{ nome: 'Mililitro', abreviacao: 'ml' },
		{ nome: 'Unidade', abreviacao: 'un' },
	];

	get nomeUnidadeSelecionada(): string {
    	const unidadeMedida = this.unidadesMedida.find(unidadeMedida => unidadeMedida.nome === this.model);
    	return unidadeMedida ? unidadeMedida.nome : 'Selecione';
  	}

	toggle() {
		this.open = !this.open;
	}

	selectUnidade(unidadeMedidaNome: string) {
		this.model = unidadeMedidaNome;
		this.modelChange.emit(unidadeMedidaNome);
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
