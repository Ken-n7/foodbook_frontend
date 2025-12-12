import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  user?: any;
}

export interface User {
  id: number;
  name: string;
  email: string;
  // add other fields you need
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api';
  private readonly tokenKey = 'auth_token';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);

  /** Check if user is authenticated */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Get token from localStorage */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Attach token to every request automatically via interceptor (recommended) */
  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  /** Register */
  register(data: { name: string; email: string; password: string, password_confirmation: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        this.saveToken(res.token);
      }),
      catchError(this.handleError)
    );
  }

  /** Login */
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.saveToken(res.token);
        this.loadUser(); // optionally load user right after login
      }),
      catchError(this.handleError)
    );
  }

  /** Load authenticated user */
  loadUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`).pipe(
      tap((user) => this.userSubject.next(user)),
      catchError(this.handleError)
    );
  }

  /** Logout */
  // Inside AuthService
  logout(navigate: boolean = true): void {
    // 1. Immediately clear client state (critical!)
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);

    // 2. Fire-and-forget the backend logout (optional)
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      error: () => console.warn('Backend logout failed (maybe offline)'),
    });

    // 3. Navigate only if requested
    if (navigate) {
      this.router.navigate(['/']);
    }
  }

  /** Global error handler */
  private handleError(err: HttpErrorResponse): Observable<never> {
    let message = 'An unknown error occurred';
    if (err.error?.message) {
      message = err.error.message;
    } else if (err.status === 401) {
      message = 'Invalid credentials';
    } else if (err.status === 0) {
      message = 'Cannot reach server';
    }

    return throwError(() => new Error(message));
  }
}
