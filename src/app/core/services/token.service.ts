import { Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TokenService {

    private readonly apiUrl = 'http://localhost:8080/users';

    private authenticatedSignal = signal<boolean>(false);

    constructor(private http: HttpClient) {}

    checkAuth() {
        return this.http.get<void>(`${this.apiUrl}/check`, { withCredentials: true }).pipe(
            tap(() => this.authenticatedSignal.set(true)),
            catchError(() => {
                this.authenticatedSignal.set(false);
                return of(null);
            })
        );
    }

    isAuthenticated(): Signal<boolean> {
        return this.authenticatedSignal.asReadonly();
    }

    clearAuth() {
        this.authenticatedSignal.set(false);
    }
}
