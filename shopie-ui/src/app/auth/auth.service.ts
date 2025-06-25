
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  passwordReset(email: string): Observable<any> {
    return this.http.post('/auth/password-reset', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post('/auth/password-reset/confirm', { token, newPassword });
  }

  register(userData: any): Observable<any> {
    return this.http.post('/auth/register', userData);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post('/auth/login', credentials);
  }
}
