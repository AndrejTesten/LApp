import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'https://localhost:7134/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(res => localStorage.setItem('jwtToken', res.token)));
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }

  getToken() {
    return localStorage.getItem('jwtToken');
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
            console.log(payload.nameid);

      return Number(payload.nameid); // nameid is the user ID claim
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
