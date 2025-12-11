import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(data: any) {
    return this.http
      .post(`${this.api}/login`, data)
      .pipe(tap((res: any) => localStorage.setItem('token', res.token)));
  }

  register(data: any) {
    return this.http
      .post(`${this.api}/register`, data)
      .pipe(tap((res: any) => localStorage.setItem('token', res.token)));
  }

  getUser() {
    return this.http.get(`${this.api}/user`);
  }

  logout() {
    return this.http
      .post(`${this.api}/logout`, {})
      .pipe(tap(() => localStorage.removeItem('token')));
  }
}
