import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { routes } from './app.routes';
import myAppConfig from './config/my-app-config';

const oktaAuth = new OktaAuth({
  issuer: myAppConfig.oidc.issuer,
  clientId: myAppConfig.oidc.clientId,
  redirectUri: myAppConfig.oidc.redirectUri,
  scopes: myAppConfig.oidc.scopes,
  pkce: true
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(withEventReplay()),

    // Import OktaAuthModule so DI knows about Okta services
    importProvidersFrom(OktaAuthModule),

    // Provide the OKTA_CONFIG token with OktaAuth instance
    {
      provide: OKTA_CONFIG,
      useValue: { oktaAuth }
    }
  ]
};
