import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Footer } from "../shared/footer/footer";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, Footer],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing {

}
