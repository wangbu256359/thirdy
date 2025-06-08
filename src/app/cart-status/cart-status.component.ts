import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
  standalone: true,  
  imports: [CommonModule, RouterModule] 
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.updateCartStatus();
  }

  updateCartStatus() {
    // Subscribe to total price changes
    this.cartService.totalPrice$.subscribe(
      (price) => {
        this.totalPrice = price;
        console.log(`💰 Total Price Updated: ${this.totalPrice.toFixed(2)}`);
      }
    );

    // Subscribe to total quantity changes
    this.cartService.totalQuantity$.subscribe(
      (quantity) => {
        this.totalQuantity = quantity;
        console.log(`🛍️ Total Items in Cart: ${this.totalQuantity}`);
      }
    );
  }

  navigateToCartDetails() {
    this.router.navigate(['/cart-details']);
  }
}
