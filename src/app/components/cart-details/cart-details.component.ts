import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
  standalone: true,  
  imports: [CommonModule, RouterModule] 
})
export class CartDetailsComponent implements OnInit {


  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // Retrieve the cart items from the service
    this.cartItems = this.cartService.cartItems;

    // Subscribe to the total price and quantity observables from the cart service
    this.cartService.totalPrice$.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity$.subscribe(
      data => this.totalQuantity = data
    );

    // Compute the total price and quantity after updating the cart
    this.cartService.computeCartTotals();
  }
  incrementQuantity(theCartItem: CartItem){
    this.cartService.addToCart(theCartItem)
  }
  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }
  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }
}
