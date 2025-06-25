import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  template: `
    <div class="auth-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" placeholder="Enter your email" />
        <div *ngIf="loginForm.controls['email']?.invalid && loginForm.controls['email']?.touched" class="error">
          Valid email is required.
        </div>

        <label for="password">Password</label>
        <input id="password" type="password" formControlName="password" placeholder="Enter your password" />
        <div *ngIf="loginForm.controls['password']?.invalid && loginForm.controls['password']?.touched" class="error">
          Password is required.
        </div>

        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #004080;
      border-radius: 8px;
      background-color: #f0f8ff;
      color: #004080;
      font-family: Arial, sans-serif;
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-top: 1rem;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      margin-top: 0.25rem;
      border: 1px solid #004080;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .error {
      color: #cc0000;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    button {
      margin-top: 1.5rem;
      width: 100%;
      padding: 0.75rem;
      background-color: #004080;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    button:disabled {
      background-color: #7a9cc6;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          alert('Login successful!');
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          alert('Login failed: ' + err.error.message || err.message);
        }
      });
    }
  }
}
