import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

    constructor(
        private tokenService: TokenService,
        private router: Router
    ) {}

    canActivate() {
        return this.tokenService.checkAuth().pipe(
            switchMap(() => {
                const isAuth = this.tokenService.isAuthenticated()();
                if (isAuth) {
                    return of(true);
                } else {
                    this.router.navigate(['/login']);
                    return of(false);
                }
            }),
            catchError(() => {
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }

    canActivateChild() {
        return this.canActivate();
    }
}
