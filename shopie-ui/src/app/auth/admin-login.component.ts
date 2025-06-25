import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Admin Login</h2>
    <form (submit)="login()" #loginForm="ngForm">
      <label>Email:
        <input type="email" [(ngModel)]="email" name="email" required #email="ngModel" />
      </label>
      <br />
      <label>Password:
        <input type="password" [(ngModel)]="password" name="password" required #password="ngModel" />
      </label>
      <br />
      <button type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
    <p *ngIf="errorMessage" style="color:red">{{ errorMessage }}</p>
  `,
  styles: []
})
export class AdminLoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<{ token: string, role: string }>('/auth/login', { email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.role === 'admin') {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/admin/products']);
        } else {
          this.errorMessage = 'Not authorized as admin';
        }
      },
      error: (err) => {
        this.errorMessage = 'Login failed: ' + (err.error?.message || err.message);
      }
    });
  }
}
