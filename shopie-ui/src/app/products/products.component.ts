import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  stock: number;
}

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  backendBaseUrl: string = 'http://localhost:3000'; // Adjust if needed

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const productsJson = localStorage.getItem('products');
    if (productsJson) {
      this.products = JSON.parse(productsJson);
    } else {
      this.products = [];
    }
    this.filteredProducts = this.products;
  }

  getImageUrl(image: string): string {
    if (!image) {
      return '';
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    return `${this.backendBaseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.shortDescription.toLowerCase().includes(term)
    );
  }

  onSearch(): void {
    this.onSearchChange();
  }

  addToCart(product: Product): void {
    if (product.stock > 0) {
      product.stock--;
      const userId = 'user1'; // Hardcoded userId for demo
      this.http.post(`${this.backendBaseUrl}/api/cart/${userId}`, { productId: product.id, quantity: 1 }).subscribe({
        next: () => {
          alert('Added ' + product.name + ' to cart.');
        },
        error: (err) => {
          alert('Failed to add product to cart: ' + err.message);
          product.stock++; // Revert stock decrement on failure
        }
      });
    }
  }
}
