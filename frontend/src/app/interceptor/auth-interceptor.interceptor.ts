import { AuthService } from '../services/auth.service';
import { HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const now = new Date(Date.now());

  if (
    auth.isLoggedIn &&
    now.getUTCSeconds() > auth.tokenExpiration
  ) {
    auth.logout();
  }

  if (!auth.token) {
    return next(req);
  }

  const bearerHeader = new HttpHeaders({
    Authorization: `Bearer ${auth.token}`,
  });

  const authReq = req.clone({
    headers: bearerHeader,
  });

  return next(authReq);
};
