import { AuthService } from '../services/auth.service';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const now = new Date(Date.now());

    if (
      this.auth.isLoggedIn &&
      now.getUTCSeconds() > this.auth.tokenExpiration
    ) {
      this.auth.logout();
    }

    if (!this.auth.token) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', this.auth.token!),
    });

    return next.handle(authReq);
  }
}
