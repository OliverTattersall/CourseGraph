import { Routes } from '@angular/router';
import { GraphPageComponent } from './graph-page/graph-page.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { RegisterInfoPageComponent } from './register-info-page/register-info-page.component';

export const routes: Routes = [
  {
    path: '',
    component: GraphPageComponent,
  },
  {
    path: 'login',
    component: LoginRegisterComponent,
  },
  {
    path: 'profile',
    component: ProfilePageComponent
  },
  {
    path: 'test',
    component: RegisterInfoPageComponent
  }
];
