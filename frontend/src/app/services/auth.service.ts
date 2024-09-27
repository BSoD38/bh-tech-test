import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '../models/jwt-payload';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: WritableSignal<User | undefined> = signal(undefined);
  isLoggedIn = false;
  tokenExpiration = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.token = localStorage.getItem('token');
    effect(() => {
      this.isLoggedIn = !!this.currentUser();
    });
  }

  _token: string | null = null;

  get token(): string | null {
    return this._token;
  }

  set token(token: string | null) {
    if (token) {
      const decodedData = jwtDecode<JWTPayload>(token);
      this.tokenExpiration = decodedData.exp;
    } else {
      this.tokenExpiration = 0;
    }

    this._token = token;
  }

  async me() {
    if (!this.token) {
      return null;
    }
    try {
      const data = await lastValueFrom(
        this.http.get<User>('api/users/auth/me'),
      );
      if (data) {
        this.currentUser.set(data);
      }
      return data;
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  async login(username: string, password: string): Promise<User> {
    const response = await fetch(`/api/users/auth/signin`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (!data.user?.username || !data.token) {
      throw new Error('Login response is invalid.');
    }

    this.currentUser.set(data.user as User);
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
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (!data.user?.username || !data.token) {
      throw new Error('Signup response is invalid.');
    }

    this.currentUser.set(data.user as User);
    this.token = data.token;
    localStorage.setItem('token', data.token);

    return data.user as User;
  }

  async changeUsername(newUsername: string): Promise<User> {
    const data = await lastValueFrom(
      this.http.post<User>(
        'api/users/auth/change-username',
        { username: newUsername },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    this.currentUser.set(data);

    return data;
  }

  logout(): void {
    this.currentUser.set(undefined);
    localStorage.removeItem('token');
    this.token = null;
    this.router.navigateByUrl('/login');
  }
}
