import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '../models/jwt-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: WritableSignal<User | undefined> = signal(undefined);
  tokenExpiration = 0;
  _token: string | null = null;

  set token(token: string | null) {
    if (token) {
      const decodedData = jwtDecode<JWTPayload>(token);
      this.tokenExpiration = decodedData.exp;
    } else {
      this.tokenExpiration = 0;
    }

    this._token = token;
  }

  get token(): string | null {
    return this._token;
  }

  constructor(private router: Router) {
    this.token = localStorage.getItem('token');
  }

  // TODO: Implement JWT refresh logic

  async login(username: string, password: string): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (!data.user?.username || !data.token) {
      throw new Error('Login response is invalid.');
    }

    this.currentUser.set(data.user as User);
    localStorage.setItem('token', data.token);

    return data.user as User;
  }

  logout(): void {
    this.currentUser.set(undefined);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}
