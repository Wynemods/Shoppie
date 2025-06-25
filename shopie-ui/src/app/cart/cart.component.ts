import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface CartItem {
  productId: number;
  quantity: number;
  product?: {
    name: string;
    price: number;
    image: string;
  };
}

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    // For demo, userId is hardcoded; in real app, get from auth context
    const userId = 'user1';
    this.http.get<CartItem[]>(`/api/cart/${userId}`).subscribe(data => {
      this.cartItems = data;
      this.loadProductDetails();
    });
  }

  loadProductDetails(): void {
    this.cartItems.forEach(item => {
      this.http.get<any>(`/api/products/${item.productId}`).subscribe(product => {
        item.product = product;
      });
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + (item.product?.price ?? 0) * item.quantity;
    }, 0);
  }
}
