import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '../models/jwt-payload';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new Subject<User | undefined>();
  isLoggedIn = false;
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
    this.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  async login(username: string, password: string): Promise<User> {
    const response = await fetch(`/api/users/auth/signin`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (!data.user?.username || !data.token) {
      throw new Error('Login response is invalid.');
    }

    this.currentUser.next(data.user as User);
    this.token = data.token;
    localStorage.setItem('token', data.token);

    return data.user as User;
  }

  // TODO: Implement JWT refresh logic

  async signup(username: string, password: string): Promise<User> {
    const response = await fetch(`/api/users/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (!data.user?.username || !data.token) {
      throw new Error('Signup response is invalid.');
    }

    this.currentUser.next(data.user as User);
    this.token = data.token;
    localStorage.setItem('token', data.token);

    return data.user as User;
  }

  logout(): void {
    this.currentUser.next(undefined);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
