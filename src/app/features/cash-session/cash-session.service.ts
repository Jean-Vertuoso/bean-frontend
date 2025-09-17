import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, of } from 'rxjs';
import { CashSession } from '../../shared/models/cash-session.model';

@Injectable({
    providedIn: 'root'
})
export class CashSessionService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8080/cashSessions';

    constructor() { }

    openCashSession(): Observable<CashSession> {
		return this.http.post<CashSession>(`${this.apiUrl}/open`, null);
    }

	closeCashSession(request: { closingAmount: number; notes?: string }): Observable<CashSession> {
		return this.http.post<CashSession>(`${this.apiUrl}/close`, request);
	}

	getActiveCashSession(): Observable<number> {
		return this.http.get<number>(`${this.apiUrl}/active`);

	}

	hasActiveCashSession(): Observable<boolean> {
		return this.getActiveCashSession().pipe (
			map(session => !! session),
			catchError(() => of(false))
		);
	}
}
