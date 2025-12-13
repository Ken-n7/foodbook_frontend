import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../interfaces/post.interface';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../post/post-card.component/post-card.component';
import { PaginatedResponse } from '../../../interfaces/paginated-response.interface';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostCardComponent, CommonModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  currentPage = 1;
  lastPage = 1;
  hasMorePages = true;
  isLoading = false;

  constructor(private postService: PostService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('FeedComponent ngOnInit — loading posts...');
    this.loadPosts(1);
  }

  loadPosts(page: number = 1): void {
    if (this.isLoading || (page > 1 && !this.hasMorePages)) return;

    this.isLoading = true;

    this.postService.getPosts(page).subscribe({
      next: (response: PaginatedResponse<Post>) => {
        const newPosts = response.data;

        if (page === 1) {
          this.posts = newPosts;
        } else {
          this.posts = [...this.posts, ...newPosts];
        }

        // Extract pagination info from meta
        this.currentPage = response.meta.current_page;
        this.lastPage = response.meta.last_page;
        this.hasMorePages = response.meta.current_page < response.meta.last_page;
        // Or simply: this.hasMorePages = !!response.links.next;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load posts', err);
        alert('Could not load feed. Please try again.');
        this.isLoading = false;
      },
    });
  }

  onLike(post: Post): void {
    const wasLiked = post.is_liked;
    post.is_liked = !wasLiked;
    post.likes_count += wasLiked ? -1 : 1;

    this.postService.toggleLike(post).subscribe({
      next: () => {
        /* optimistic success */
      },
      error: () => {
        post.is_liked = wasLiked;
        post.likes_count += wasLiked ? 1 : -1;
        alert('Like failed. Try again.');
      },
    });
  }

  onScroll(): void {
    if (this.currentPage < this.lastPage && !this.isLoading) {
      this.loadPosts(this.currentPage + 1);
    }
  }
}
