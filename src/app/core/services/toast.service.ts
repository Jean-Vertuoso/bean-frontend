import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})

export class ToastService {

	constructor() { }

	showToast(icon: SweetAlertIcon, title: string, timer: number = 2200) {
		Swal.fire({
			toast: true,
			position: 'top-end',
			icon,
            title,
            showConfirmButton: false,
            timer,
            timerProgressBar: true,
            customClass: {
                popup: 'swal2-toast-custom'
            }
		});
	}

	success(message: string) {
        this.showToast('success', message);
    }

    error(message: string) {
        this.showToast('error', message);
    }

    warning(message: string) {
        this.showToast('warning', message);
    }

    info(message: string) {
        this.showToast('info', message);
    }
}
