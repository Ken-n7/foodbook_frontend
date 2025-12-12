import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from '../post/post.create/post.create';
import { RestaurantService } from '../../services/restaurant.service';
import { FeedComponent } from '../feed/feed.component/feed.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CreatePostComponent, FeedComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  restaurants: any[] = [];
  loading = true;

  constructor(
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe({
      next: (res) => {
        this.restaurants = res;
        this.loading = false;
        this.cdr.detectChanges(); // ← This line fixes everything
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
