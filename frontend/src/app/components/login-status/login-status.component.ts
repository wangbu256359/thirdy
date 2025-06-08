import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-status',
  standalone: true,  
  imports: [NgIf, CommonModule, RouterModule],
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  userFullname = '';
  private authStateSub?: Subscription;

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    this.authStateSub = this.oktaAuthService.authState$.subscribe(result => {
      this.isAuthenticated = result.isAuthenticated ?? false;
      this.getUserDetails();
    });
  }

  ngOnDestroy(): void {
    this.authStateSub?.unsubscribe();
  }

  private getUserDetails(): void {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(user => {
        this.userFullname = user.name ?? '';
      });
    }
  }

  logout(): void {
    this.oktaAuth.signOut();
  }

//   login(): void {
//   this.oktaAuth.signInWithRedirect();  // Redirects to Okta sign-in
// }
}
