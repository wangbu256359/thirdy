import { Inject, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, Routes } from '@angular/router';

import { AppComponent } from '../app.component';
import { ProductCategoryMenuComponent } from '../product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductService } from '../services/product.service';
import { CartStatusComponent } from '../cart-status/cart-status.component';
import { CartDetailsComponent } from '../components/cart-details/cart-details.component';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../components/login/login.component';
import { LoginStatusComponent } from '../components/login-status/login-status.component';

import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG,
  OktaAuthGuard
} from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

import myAppConfig from '../config/my-app-config';
import { MemberPageComponent } from '../components/member-page/member-page.component';

// Create OktaAuth instance using config from myAppConfig
const oktaAuth = new OktaAuth(myAppConfig.oidc);

// function sentToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
//   //use injector
//   const router = injector.get(Router);
//   //redirect
//   router.navigate(['/login']);
// }
function sentToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  const router = injector.get(Router);
  router.navigate(['/login']); // navigate to http://localhost:4200/login
}

const routes: Routes = [
  { path: 'members', component: MemberPageComponent,canActivate: [OktaAuthGuard] ,
                    data: {onAuthRequred: sentToLoginPage}
  },
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'search/:keyword', component: ProductCategoryMenuComponent },
  { path: 'category/:id', component: ProductCategoryMenuComponent },
  { path: 'category', redirectTo: 'category/1', pathMatch: 'full' },
  { path: 'products', component: ProductCategoryMenuComponent },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductCategoryMenuComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    LoginComponent,
    LoginStatusComponent,
    CheckoutComponent,
    MemberPageComponent   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule,
    NgbPaginationModule,
    CommonModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [
    ProductService,
    { provide: OKTA_CONFIG, useValue: { oktaAuth } }  // Provide OktaAuth instance here
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
