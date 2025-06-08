import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  public totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  totalPrice$: Observable<number> = this.totalPrice.asObservable();
  totalQuantity$: Observable<number> = this.totalQuantity.asObservable();

  private storage: Storage | null = null;

  constructor() {
    // Ensure sessionStorage is only accessed in the browser
    if (typeof window !== 'undefined' && window.sessionStorage) {
      this.storage = sessionStorage;

      const data = JSON.parse(this.storage.getItem('cartItems') || '[]');

      if (data != null) {
        this.cartItems = data;
        this.computeCartTotals();
      }
    }
  }

  persistCartItems() {
    if (this.storage) {
      this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  addToCart(cartItem: CartItem) {
    const existingCartItem = this.cartItems.find(item => item.id === cartItem.id);

    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  removeFromCart(cartItem: CartItem) {
    this.cartItems = this.cartItems.filter(item => item.id !== cartItem.id);
    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.removeFromCart(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    const index = this.cartItems.findIndex(item => item.id === theCartItem.id);

    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.computeCartTotals();
    }
  }

  clearCart() {
    this.cartItems = [];
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPrice = 0;
    let totalQuantity = 0;

    this.cartItems.forEach(item => {
      totalPrice += item.quantity * item.unitPrice;
      totalQuantity += item.quantity;
    });

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
    this.logCartData(totalPrice, totalQuantity);
    this.persistCartItems();
  }

  logCartData(totalPrice: number, totalQuantity: number) {
    console.log('Contents of the cart:');
    for (let item of this.cartItems) {
      const subTotal = item.quantity * item.unitPrice;
      console.log(`name: ${item.name}, quantity: ${item.quantity}, unitPrice: ${item.unitPrice}, subTotal: ${subTotal}`);
    }
    console.log(`Total Price: ${totalPrice.toFixed(2)}, Total Quantity: ${totalQuantity}`);
    console.log('-------------------');
  }

}
