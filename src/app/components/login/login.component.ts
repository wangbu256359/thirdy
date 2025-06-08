import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private oktaSignin: any;

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip if not in browser
    }

    const OktaSignIn = (await import('@okta/okta-signin-widget')).default;

    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });

    this.oktaSignin.remove(); // Clean up any prior instance

    this.oktaSignin.renderEl(
      { el: '#okta-sign-in-widget' },
      (res: any) => {
        if (res.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (err: any) => console.error('Okta Widget error:', err)
    );
  }

  ngOnDestroy(): void {
    this.oktaSignin?.remove(); // Clean up widget on component destroy
  }
}
