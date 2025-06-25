import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  selector: 'app-admin-product-management',
  templateUrl: './admin-product-management.component.html',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AdminProductManagementComponent implements OnInit {
  products: Product[] = [];
  editingProduct: Product | null = null;
  isNewProduct: boolean = false;
  uploading: boolean = false;

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
  }

  saveProductsToStorage(): void {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  startAddProduct(): void {
    this.editingProduct = { id: 0, name: '', shortDescription: '', price: 0, image: '', stock: 0 };
    this.isNewProduct = true;
  }

  startEditProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.isNewProduct = false;
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }

  saveProduct(): void {
    if (!this.editingProduct) return;

    if (!this.editingProduct.image) {
      this.editingProduct.image = '';
    }

    if (this.isNewProduct) {
      // Assign new ID
      const maxId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0;
      this.editingProduct.id = maxId + 1;
      this.products.push(this.editingProduct);
    } else {
      const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
      if (index !== -1) {
        this.products[index] = this.editingProduct;
      }
    }
    this.saveProductsToStorage();
    this.loadProducts();
    this.editingProduct = null;
  }

  deleteProduct(product: Product): void {
    this.products = this.products.filter(p => p.id !== product.id);
    this.saveProductsToStorage();
    this.loadProducts();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.uploading = true;
    this.http.post<{ imageUrl: string }>('/api/products/upload-image', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        if (this.editingProduct) {
          this.editingProduct.image = event.body?.imageUrl || '';
        }
        this.uploading = false;
      }
    }, () => {
      this.uploading = false;
    });
  }
}
