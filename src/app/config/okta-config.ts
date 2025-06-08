import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './my-app-config';

export function createOktaAuth(platformId: Object): OktaAuth | null {
  if (isPlatformBrowser(platformId)) {
    return new OktaAuth({
      issuer: myAppConfig.oidc.issuer,
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      scopes: myAppConfig.oidc.scopes,
      pkce: true
    });
  }
  return null; // or a stub for SSR
}
