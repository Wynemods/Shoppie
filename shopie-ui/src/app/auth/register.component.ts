import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  template: `
    <div class="auth-container">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <label for="name">Name</label>
        <input id="name" type="text" formControlName="name" placeholder="Enter your name" />
        <div *ngIf="registerForm.controls['name'].invalid && registerForm.controls['name'].touched" class="error">
          Name is required.
        </div>

        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" placeholder="Enter your email" />
        <div *ngIf="registerForm.controls['email'].invalid && registerForm.controls['email'].touched" class="error">
          Valid email is required.
        </div>

        <label for="password">Password</label>
        <input id="password" type="password" formControlName="password" placeholder="Enter your password" />
        <div *ngIf="registerForm.controls['password'].invalid && registerForm.controls['password'].touched" class="error">
          Password is required (min 6 characters).
        </div>

        <label for="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" formControlName="confirmPassword" placeholder="Confirm your password" />
        <div *ngIf="registerForm.controls['confirmPassword'].invalid && registerForm.controls['confirmPassword'].touched" class="error">
          Passwords must match.
        </div>

        <button type="submit" [disabled]="registerForm.invalid">Register</button>
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
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          alert('Registration failed: ' + err.error.message || err.message);
        }
      });
    }
  }
}
