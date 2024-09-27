import {
  Component, effect,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatError,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  error: WritableSignal<string> = signal('');

  userSub?: Subscription;

  ngOnInit() {
    if (this.authService.currentUser()) {
      this.router.navigateByUrl('/graph');
    }
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  async submit(): Promise<void> {
    if (!this.loginForm.valid) {
      return;
    }
    const values = this.loginForm.value;
    try {
      await this.authService.login(values.username!, values.password!);
      this.router.navigateByUrl('/graph');
    } catch (error) {
      console.error(error);
      this.error.set('Login failed');
    }
  }

  async signup(): Promise<void> {
    if (!this.loginForm.valid) {
      return;
    }
    const values = this.loginForm.value;
    try {
      await this.authService.signup(values.username!, values.password!);
      this.router.navigateByUrl('/graph');
    } catch (error) {
      console.error(error);
      this.error.set('Signup failed');
    }
  }
}
