import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getLoggedInStatus().pipe(
      take(1),
      switchMap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/account/login']);
          return of(false); // نرجع Observable<boolean>
        }

        const currentUrl = this.router.url.split('?')[0];
        if (currentUrl === '/admin' || currentUrl.startsWith('/admin/')) {
          return this.authService.getUserRole().pipe(
            take(1),
            map((role: string | null) => {
              if (role !== 'admin') {
                this.router.navigate(['/exam-list']);
                return false;
              }
              return true;
            })
          );
        }

        return of(true); // نرجع Observable<boolean>
      })
    );
  }
}
