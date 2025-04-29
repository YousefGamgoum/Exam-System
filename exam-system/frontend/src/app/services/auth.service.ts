import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private tokenKey = 'auth_token';
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn()); // أضيفي ده

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialLoginStatus();
  }

  private checkInitialLoginStatus(): void {
    const isLoggedIn = !!localStorage.getItem(this.tokenKey);
    this.loggedInSubject.next(isLoggedIn);
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  register(userData: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.loggedInSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
function открыть(
  arg0: string,
  credentials: { email: string; password: string }
) {
  throw new Error('Function not implemented.');
}
