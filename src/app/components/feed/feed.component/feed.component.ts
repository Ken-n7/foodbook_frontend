import { Component, OnInit, ChangeDetectorRef, ViewContainerRef, ComponentRef } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Post, PaginatedResponse } from '../../../interfaces/post.interface';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../post/post-card.component/post-card.component';
import { PostDetailModalComponent } from '../../post/post-detail-modal.component/post-detail-modal.component'; // ← Add import

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
  isLoading = false;

  constructor(
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('FeedComponent ngOnInit — loading posts...');
    this.loadPosts(1);
  }

  loadPosts(page: number = 1): void {
    if (this.isLoading) return;
    this.isLoading = true;

    this.postService.getPosts(page).subscribe({
      next: (response: PaginatedResponse<Post>) => {
        if (page === 1) {
          this.posts = response.data;
        } else {
          this.posts = [...this.posts, ...response.data];
        }

        this.currentPage = response.current_page;
        this.lastPage = response.last_page;
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
      next: () => { /* optimistic success */ },
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
