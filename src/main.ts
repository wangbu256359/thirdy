import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, PLATFORM_ID } from '@angular/core';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { createOktaAuth } from './app/config/okta-auth'; // adjust path

import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(OktaAuthModule),
    {
      provide: OKTA_CONFIG,
      useFactory: () => ({ oktaAuth: createOktaAuth() }),
      deps: [PLATFORM_ID]
    }
  ]
});
