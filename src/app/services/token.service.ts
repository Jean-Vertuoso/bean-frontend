import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private httpClient: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.httpClient.get('http://localhost:8080/user/check').pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
