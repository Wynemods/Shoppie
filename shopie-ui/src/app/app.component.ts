import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <header style="background-color: #004080; color: white; padding: 1rem;">
      <h1>Shopie Online Store</h1>
      <nav>
        <a routerLink="/" routerLinkActive="active" style="color: white; margin-right: 15px; text-decoration: none;">Products</a>
        <a routerLink="/cart" routerLinkActive="active" style="color: white; margin-right: 15px; text-decoration: none;">Cart</a>
        <a routerLink="/admin/products" routerLinkActive="active" style="color: white; margin-right: 15px; text-decoration: none;">Admin</a>
        <a routerLink="/login" routerLinkActive="active" style="color: white; margin-right: 15px; text-decoration: none;">Login</a>
        <a routerLink="/register" routerLinkActive="active" style="color: white; margin-right: 15px; text-decoration: none;">Register</a>
      </nav>
    </header>
    <main style="padding: 1rem;">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    a.active {
      font-weight: bold;
      text-decoration: underline;
    }
  `],
  imports: [CommonModule, RouterModule]
})
export class AppComponent {}
