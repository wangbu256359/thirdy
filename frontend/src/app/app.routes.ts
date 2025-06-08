import { Router, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { LoginComponent } from './components/login/login.component';
import { MemberPageComponent } from './components/member-page/member-page.component';
import OktaAuth from '@okta/okta-auth-js';
import { Injector } from '@angular/core';

function sentToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  //use injector
  const router = injector.get(Router);
  //redirect
  router.navigate(['/login']);
}

export const routes: Routes = [
  { path: '', redirectTo: 'category/1', pathMatch: 'full' }, 
  { path: 'category/:id', component: ProductListComponent }, 
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },
  {path: 'members', component: MemberPageComponent,canActivate: [OktaAuthGuard] ,
                      data: {onAuthRequired: sentToLoginPage}}
  
];
