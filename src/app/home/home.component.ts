import { CashSessionService } from './../features/cash-session/cash-session.service';
import { Component } from '@angular/core';
import { ToastService } from '../core/services/toast.service';
import Swal from 'sweetalert2';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

	private cashSessionService : CashSessionService;
	private toast : ToastService;

	constructor(cashSessionService : CashSessionService, toast : ToastService){
		this.cashSessionService = cashSessionService;
		this.toast = toast;
	}

	public openCashSession() {
		this.cashSessionService.hasActiveCashSession().pipe(take(1)).subscribe(exists => {
			if (exists) {
				Swal.fire('Alerta!', '<strong>Já existe uma sessão ativa.</strong><br>Use a sessão existente ou a finalize para iniciar uma nova sessão.','warning');
			} else {
				this.cashSessionService.openCashSession().subscribe({
					next: () => Swal.fire('Sucesso!', 'Sessão de caixa aberta.', 'success'),
					error: () => Swal.fire('Erro!', 'Não foi possível abrir a sessão.', 'error')
				});
			}

		})
	}

	public confirmOpenSession() {
		Swal.fire({
			title: 'Abrir sessão de caixa?',
			text: 'Deseja realmente abrir a sessão de caixa?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Sim',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if(result.isConfirmed) {
				this.openCashSession();
			}
		});
	}
}
