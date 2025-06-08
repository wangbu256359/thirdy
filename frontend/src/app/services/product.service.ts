import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductCategory } from '../common/product-category';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 

 
  private readonly baseUrl = 'http://localhost:8080/api/products'; 
  private readonly categoryURL = 'http://localhost:8080/api/product-category'; 

  constructor(private httpClient: HttpClient) {}

  getProduct(theProductId: number): Observable<Product> {
    
    //build url
    const productUrl = `${this.baseUrl}/${theProductId}`;
   // return this.getProduct(productUrl);
    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(theCategoryID: number): Observable<Product[]> {


    //todo here  = 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryID}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response?._embedded?.products ?? []), 
      catchError(error => {
        console.error('Error fetching product list:', error);
        return throwError(() => new Error('Failed to load products, please try again later.'));
      })
    );
  }

  getProductListPaginate(
                        thePage:number,
                        thePageSize:number,
                        theCategoryID: number): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryID}`
                    + `&page=${thePage}&size=${thePageSize}`;

     return this.httpClient.get<GetResponseProduct>(searchUrl);

  }


  getProductCategories(): Observable<ProductCategory[]> {
    return this.getProducts();

  }
  private getProducts(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryURL).pipe(
      map(response => response._embedded?.productCategory ?? []),
      catchError(error => {
        console.error('Error fetching product categories:', error);
        return throwError(() => new Error('Failed to load product categories, please try again later.'));
      })
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    //keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response?._embedded?.products ?? []), 
      catchError(error => {
        console.error('Error fetching product list:', error);
        return throwError(() => new Error('Failed to load products, please try again later.'));
      })
    );
  }

  searchProductsPaginate(
                         thePage:number,
                         thePageSize:number,
                         theKeyword: string): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    + `&page=${thePage}&size=${thePageSize}`;

        return this.httpClient.get<GetResponseProduct>(searchUrl);

  }
}


interface GetResponseProduct {
  _embedded?: {
    products: Product[];
  };
  page: {
    totalElements: number;
    size: number,
    totalElement: number,
    totalPages: number,
    number: number

  }
}
interface GetResponseProductCategory {
  _embedded?: {
    productCategory: ProductCategory[];
  };
}