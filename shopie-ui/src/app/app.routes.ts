import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { AdminProductManagementComponent } from './admin-product-management/admin-product-management.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { PasswordResetComponent } from './auth/password-reset.component';
import { PasswordResetConfirmComponent } from './auth/password-reset-confirm.component';
import { AdminLoginComponent } from './auth/admin-login.component';

export const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin/products', component: AdminProductManagementComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'password-reset-confirm', component: PasswordResetConfirmComponent },
];
