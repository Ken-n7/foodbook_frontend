import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Footer } from "../../shared/footer/footer";
import { LoginComponent } from '../../auth/login.component/login.component'
import { RegisterComponent } from '../../auth/register.component/register.component';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, Footer, LoginComponent, RegisterComponent],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing {

}
