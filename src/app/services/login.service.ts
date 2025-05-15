import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
	apiUrl: string = "http://localhost:8080/user/login"

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(email: string, password: string){
	return this.httpClient.post(this.apiUrl, {email, password}).pipe(
		tap((value) => {
			console.log(document.cookie);
			this.router.navigate(['/home']);
		})
	);
  }
}
