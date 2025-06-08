import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../common/product';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CartItem } from '../common/cart-item';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {  
  product?: Product;  

  constructor(private productService: ProductService,
              private cartService: CartService, 
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      if (isNaN(productId) || productId <= 0) {
        console.error('Invalid product ID:', productId);
        return;
      }
      this.getProductDetails(productId);
    });
  }

  private getProductDetails(productId: number): void {
    this.productService.getProduct(productId).subscribe({
      next: (data) => {
        if (!data) {
          console.warn('Product not found:', productId);
          return;
        }
        this.product = data;
      },
      error: (err) => console.error('Error fetching product:', err)
    });
  }
  addToCart()
  {
    console.log(`adding to cart: ${this.product?.name}, ${this.product?.unitPrice}`)
    const theCartItem = new CartItem(this.product!);
    this.cartService.addToCart(theCartItem);

  }
}
