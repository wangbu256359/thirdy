import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // ✅ Import RouterModule
import { ProductService } from '../services/product.service';
import { ProductCategory } from '../common/product-category';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,  // ✅ Ensure standalone is enabled
  imports: [CommonModule, RouterModule],  // ✅ Import RouterModule here
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {
  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories = data;
        console.log('Product Categories=', JSON.stringify(data));
      },
      error => {
        console.error('Error fetching product categories:', error);
      }
    );
  }
}
