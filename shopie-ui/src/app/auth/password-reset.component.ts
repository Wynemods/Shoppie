import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  template: `
    <div class="auth-container">
      <h2>Password Reset</h2>
      <form [formGroup]="passwordResetForm" (ngSubmit)="onSubmit()">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" placeholder="Enter your email" />
        <div *ngIf="passwordResetForm.controls['email'].invalid && passwordResetForm.controls['email'].touched" class="error">
          Valid email is required.
        </div>

        <button type="submit" [disabled]="passwordResetForm.invalid">Reset Password</button>
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
export class PasswordResetComponent {
  passwordResetForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.passwordResetForm.valid) {
      this.authService.passwordReset(this.passwordResetForm.value.email).subscribe({
        next: () => {
          alert('Password reset email sent! Please check your inbox.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Password reset failed: ' + err.error.message || err.message);
        }
      });
    }
  }
}
