import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	private readonly apiUrl = 'http://localhost:8080/users';

	constructor(private http: HttpClient) {}

	login(email: string, password: string): Observable<any> {
		return this.http.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
	}

	logout(): Observable<any> {
		return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
	}

	checkAuth(): Observable<any> {
		return this.http.get(`${this.apiUrl}/check`, { withCredentials: true });
	}
}
