import { Component, Injectable } from '@angular/core';
import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { Home } from './components/home/home';
import { AuthGuard } from './auth/auth.guard';
import { LogoutComponent } from './components/auth/logout.component/logout.component';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent }
];
