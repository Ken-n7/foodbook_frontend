import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Landing } from './components/pages/landing/landing';
import { Home } from './components/pages/home/home';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { LogoutComponent } from './components/auth/logout.component/logout.component';
import { Profile } from './components/pages/profile/profile';

export const routes: Routes = [
  { path: 'welcome', component: Landing, canActivate: [GuestGuard] },
  { path: '', component: Home, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: 'profile/:id', component: Profile},
];
