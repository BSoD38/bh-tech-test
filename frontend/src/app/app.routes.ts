import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { GraphPageComponent } from './pages/graph-page/graph-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'graph', component: GraphPageComponent, canActivate: [AuthGuard] },
];
