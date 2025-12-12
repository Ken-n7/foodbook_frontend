import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent {
  constructor() {
    inject(AuthService).logout();
    // No need to do anything else — logout() already navigates
  }
}
