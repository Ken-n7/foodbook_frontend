import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.logout().subscribe({
      next: () => {
        alert: ('Logged Out')
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Logout failed');
        this.router.navigate(['/']);
      }
    });
  }
}
