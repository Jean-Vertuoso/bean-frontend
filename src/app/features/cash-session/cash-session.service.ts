import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, throwError, catchError, of } from 'rxjs';
import { CashSessionResponse } from '../../shared/models/cash-session.model';

@Injectable({
    providedIn: 'root'
})
export class CashSessionService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8080/cashSessions';

    constructor() { }

    openCashSession(): Observable<CashSessionResponse> {
		return this.http.post<CashSessionResponse>(`${this.apiUrl}/new`, null).pipe(
			map(dto => ({
				...dto,
				openingTimestamp: new Date(dto.openingTimestamp),
				closingTimestamp: dto.closingTimestamp ? new Date(dto.closingTimestamp) : undefined
			}))
		);
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
