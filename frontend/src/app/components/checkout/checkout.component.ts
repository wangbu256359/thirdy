import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { error, log } from 'console';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { response } from 'express';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!: FormGroup;
  
  totalPrice: number = 0;
  totalQuantity: number =0;

  creditCardYears: number[] =[];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private router: Router,
              private luv2ShopFormService: Luv2ShopFormService,
              private formBuilder: FormBuilder,
              private cartService: CartService,
              private checkoutService: CheckoutService
  ) {

  }
  ngOnInit(): void{
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                  [Validators.required, 
                                   Validators.minLength(2),
                                   Luv2ShopValidators.notOnlyWhitespace]),

        lastName: new FormControl('', 
                                  [Validators.required, 
                                    Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl('',
                             [Validators.required, 
                             Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')] )
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                  [Validators.required, 
                                   Validators.minLength(2),
                                   Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', 
                                  [Validators.required, 
                                   Validators.minLength(2),
                                   Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', 
                                  [Validators.required]), 
                                  
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',[
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace
          ])
      }),

    billingAddress: this.formBuilder.group({
    street: ['', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]],
    city: ['', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]],
    state: ['', [Validators.required]],
    country: ['', [Validators.required]],
    zipCode: ['',[ Validators.required, Validators.minLength(2),Luv2ShopValidators.notOnlyWhitespace
]]
  }),
    creditCard: this.formBuilder.group({
    cardType: ['', [Validators.required]],
    nameOnCard: ['', [Validators.required, Luv2ShopValidators.notOnlyWhitespace]],
    cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]],
    securityCode: ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
    expirationMonth: ['',],
    expirationYear: ['',]
})
    });

    this.cartService.totalPrice.subscribe(
      data => {
        console.log("Cart total price: " + data);
        this.totalPrice = data;
      }
    );

    this.cartService.totalQuantity.subscribe(
      data => {
        console.log("Cart total quantity: " + data);
        this.totalQuantity = data;
      }
    );


    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card year: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card year: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    this.luv2ShopFormService.getContries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  onSubmit(){
    console.log("Handling submit");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    if (this.checkoutFormGroup.invalid ) {
    
      this.checkoutFormGroup.markAllAsTouched();
         console.warn('Form is invalid. Here are the invalid controls:');
      this.logInvalidControls(this.checkoutFormGroup);
      return;
    }
    
    //order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart
    const cartItems = this.cartService.cartItems;

    //create oderitems from cartitems
    //long way
    /*
    let orderitems: OrderItem[] = [];
    for (let i=0; i<cartItems.length; i++){
      orderitems[i] = new OrderItem(cartItems[i])
    }
      */
    //short cut
    let orderItemsShort: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //setup purchase
    let purchase = new Purchase();

    //customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //shipping address
   purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.shippingAddress!.state = shippingState.name;
    purchase.shippingAddress!.country = shippingCountry.name;
    //billing add
      purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    purchase.billingAddress!.state = billingState.name;
    purchase.billingAddress!.country = billingCountry.name;
    //purchase order and orderitems
    purchase.order = order;
    purchase.orderItems = orderItemsShort;

    //call rest api

    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
//reset cart
          this.resetCart();
          
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );
  }
  private logInvalidControls(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.logInvalidControls(control);
      } else if (control && control.invalid) {
        console.warn(`Invalid control: ${key}`, control.errors);
      }
    });
  }
  resetCart() {
    //cart
    this.cartService.cartItems =[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //form
    this.checkoutFormGroup.reset();

    //navigate back to product
    this.router.navigateByUrl("/products");
  }

  // get firstName() { return this.checkoutFormGroup.get('costumer.firstName');}
  // get lastName() { return this.checkoutFormGroup.get('costumer.lastName');}
  // get email() { return this.checkoutFormGroup.get('costumer.email');}

     get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
     get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
     get email() { return this.checkoutFormGroup.get('customer.email'); }

     get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
     get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
     get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
     get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
     get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

     get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
     get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
     get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
     get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
     get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

      get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
      get creditCardnameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
      get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
      get creditCardsecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
      // get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
      // get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }


  copyShippingAddresstoBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
  handleMonthsAndYears() {

    const creditCardFormgroup = this.checkoutFormGroup.get('creditCard')
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormgroup?.value.expirationYear);

    let startMonth : number;

    if (currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
     data => {
      console.log("Retrieved credit Months: " + JSON.stringify(data));
      this.creditCardMonths = data;
     }
    );
  }

  getStatus(formGroupName: string) {
    const formGroup =this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`{formGroupName} country code: ${countryCode}`);
    console.log(`{formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        const stateControl = formGroup?.get('state');

        if (stateControl && data.length > 0) {
          stateControl.setValue(data[0]);
        }
      }
    );
  }
}
