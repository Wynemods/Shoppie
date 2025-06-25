import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset-confirm',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="auth-container">
      <h2>Reset Your Password</h2>
      <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
        <label for="newPassword">New Password</label>
        <input id="newPassword" type="password" formControlName="newPassword" placeholder="Enter new password" />
        <div *ngIf="resetForm.controls['newPassword'].invalid && resetForm.controls['newPassword'].touched" class="error">
          Password is required and must be at least 6 characters.
        </div>

        <label for="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" formControlName="confirmPassword" placeholder="Confirm new password" />
        <div *ngIf="resetForm.controls['confirmPassword'].invalid && resetForm.controls['confirmPassword'].touched" class="error">
          Passwords must match.
        </div>

        <button type="submit" [disabled]="resetForm.invalid">Reset Password</button>
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
export class PasswordResetConfirmComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      alert('Invalid or missing password reset token.');
      this.router.navigate(['/login']);
    }
  }

  passwordsMatch(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.authService.resetPassword(this.token, this.resetForm.value.newPassword).subscribe({
        next: () => {
          alert('Password has been reset successfully. Please login with your new password.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Password reset failed: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
