import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './my-app-config';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export function createOktaAuth() {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    return new OktaAuth({
      issuer: myAppConfig.oidc.issuer,
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      scopes: myAppConfig.oidc.scopes,
      pkce: true
    });
  }

  // When NOT in the browser (e.g. during SSR), return null or a dummy object
  return null as any;
}
