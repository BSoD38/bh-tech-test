import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: WritableSignal<User | undefined> = signal(undefined);

  constructor() { }

  async setup(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token || this.currentUser()) {
      return;
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({token})
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (!data?.user || !data.token) {
      throw new Error("Refresh response is invalid.");
    }

    this.currentUser.set(data.user as User);
    localStorage.setItem("token", data.token);
  }

  async login(username: string, password: string): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({username, password})
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (!data.user?.username || !data.token) {
      throw new Error("Login response is invalid.");
    }

    this.currentUser.set(data.user as User);
    localStorage.setItem("token", data.token);

    return data.user as User;
  }

  logout(): void {
    this.currentUser.set(undefined);
    localStorage.removeItem("token");
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}
