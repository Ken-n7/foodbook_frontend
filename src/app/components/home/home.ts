import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from '../post/post.create/post.create';
import { RestaurantService } from '../../services/restaurant.service'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CreatePostComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  restaurants: any[] = [];
  loading = true;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe({
      next: (res) => {
        this.restaurants = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
