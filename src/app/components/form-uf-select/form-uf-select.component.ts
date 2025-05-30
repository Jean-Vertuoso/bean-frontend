import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'app-form-uf-select',
	imports: [
		CommonModule,
		FormsModule
	],
	templateUrl: './form-uf-select.component.html',
	styleUrl: './form-uf-select.component.scss'
})
export class FormUfSelectComponent {
	@Input() model: string = '';
  	@Output() modelChange = new EventEmitter<any>();

	open = false;

	ufs = [
		{ sigla: 'AC', nome: 'Acre' },
		{ sigla: 'AL', nome: 'Alagoas' },
		{ sigla: 'AP', nome: 'Amapá' },
		{ sigla: 'AM', nome: 'Amazonas' },
		{ sigla: 'BA', nome: 'Bahia' },
		{ sigla: 'CE', nome: 'Ceará' },
		{ sigla: 'DF', nome: 'Distrito Federal' },
		{ sigla: 'ES', nome: 'Espírito Santo' },
		{ sigla: 'GO', nome: 'Goiás' },
		{ sigla: 'MA', nome: 'Maranhão' },
		{ sigla: 'MT', nome: 'Mato Grosso' },
		{ sigla: 'MS', nome: 'Mato Grosso do Sul' },
		{ sigla: 'MG', nome: 'Minas Gerais' },
		{ sigla: 'PA', nome: 'Pará' },
		{ sigla: 'PB', nome: 'Paraíba' },
		{ sigla: 'PR', nome: 'Paraná' },
		{ sigla: 'PE', nome: 'Pernambuco' },
		{ sigla: 'PI', nome: 'Piauí' },
		{ sigla: 'RJ', nome: 'Rio de Janeiro' },
		{ sigla: 'RN', nome: 'Rio Grande do Norte' },
		{ sigla: 'RS', nome: 'Rio Grande do Sul' },
		{ sigla: 'RO', nome: 'Rondônia' },
		{ sigla: 'RR', nome: 'Roraima' },
		{ sigla: 'SC', nome: 'Santa Catarina' },
		{ sigla: 'SP', nome: 'São Paulo' },
		{ sigla: 'SE', nome: 'Sergipe' },
		{ sigla: 'TO', nome: 'Tocantins' },
	];

	get nomeUfSelecionada(): string {
    	const uf = this.ufs.find(uf => uf.sigla === this.model);
    	return uf ? uf.nome : 'Selecione';
  	}

	toggle() {
		this.open = !this.open;
	}

	selectUf(ufSigla: string) {
		this.model = ufSigla;
		this.modelChange.emit(ufSigla);
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
