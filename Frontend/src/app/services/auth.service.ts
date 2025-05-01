import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = new BehaviorSubject<string | null>(this.getStoredRole());

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          this.loggedInStatus.next(true);
          this.userRole.next(response.role);
          console.log('Role saved in AuthService:', response.role);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.loggedInStatus.next(false);
    this.userRole.next(null);
    console.log('Logged out, role cleared');
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedInStatus.asObservable();
  }

  getUserRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredRole(): string | null {
    return localStorage.getItem('role');
  }
}
