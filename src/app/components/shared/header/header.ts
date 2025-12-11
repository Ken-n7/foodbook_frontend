import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../../auth/login.component/login.component';
import { RegisterComponent } from '../../auth/register.component/register.component';
import { Logo } from '../logo/logo';
import { SearchBar } from '../search-bar/search-bar';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginComponent, RegisterComponent, Logo, SearchBar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
    constructor(public auth: AuthService) {}
}
