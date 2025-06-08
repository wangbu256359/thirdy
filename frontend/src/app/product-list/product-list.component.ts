import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../common/product';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule for *ngFor
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from '../common/cart-item';
import { CartService } from '../services/cart.service'; 

@Component({
  selector: 'app-product-list',
  standalone: true, // ✅ Mark as standalone
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule, RouterModule, NgbPaginationModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  priviousCategoryId: number =1;
  searchMode: boolean = false;
  
  thePageNumber: number =1;
  thePageSize: number = 5;
  theTotalElements: number =0;
 
  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private route: ActivatedRoute,  
              private cartService: CartService ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    console.log('🔍 Search Mode:', this.searchMode);
    console.log('🌐 Current Route Params:', this.route.snapshot.paramMap.keys);

    if (this.searchMode){
        console.log('✅ Running handleSearchProduct()');
        this.handleSearchProduct(); // <-- Ensure this runs
    }
    else {
        console.log('📂 Running handleListProduct()');
        this.handleListProduct();
    }
}

  handleSearchProduct() {
    const theKeyword: string | null = this.route.snapshot.paramMap.get('keyword') ?? '';
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);
   
    if (!theKeyword) {
      console.warn('No keyword provided for search.');
      this.products = []; 
      return;
    }
  
    console.log('Searching products with keyword:', theKeyword);
  
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                              this.thePageSize,
                                              theKeyword).subscribe(data => this.processResult(data));
  }

  handleListProduct(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1;

    }
    else
    {
        this.currentCategoryId =0;

    }

    if (this.priviousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.priviousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

//get Category ID 
    this.productService.getProductListPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(data => this.processResult(data));;
  }

  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.listProducts();

  }

  processResult(data: any) {  
    this.products = data._embedded?.products ?? [];
    this.thePageNumber = data.page.number + 1;
    this.thePageSize = data.page.size;
    this.theTotalElements = data.page.totalElements;
}
  addToCart(theProduct: Product){this.ngOnInit
    
    console.log(`🛒 Added to cart: ${theProduct.name} (${theProduct.unitPrice})`);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);

  }
  

}

