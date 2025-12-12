import { RouterLink } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../interfaces/post.interface';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent {
  @Input() post!: Post;
  @Output() like = new EventEmitter<Post>();
  @Output() comment = new EventEmitter<Post>();

  constructor(private postService: PostService) {}

  onLike(post: Post): void {
    const wasLiked = post.is_liked;

    // Optimistic update
    post.is_liked = !wasLiked;
    post.likes_count += wasLiked ? -1 : 1;

    this.postService.toggleLike(post).subscribe({
      next: (res: any) => {
        // Optional: sync with server response
        post.is_liked = res.is_liked;
        post.likes_count = res.likes_count;
      },
      error: () => {
        // Revert
        post.is_liked = wasLiked;
        post.likes_count += wasLiked ? 1 : -1;
        alert('Network error. Try again.');
      },
    });
  }

  onComment(event: Event): void {
    event.stopPropagation();
    this.comment.emit(this.post);
  }

  onShare(): void {
    if (navigator.share && this.post.media.length > 0) {
      navigator
        .share({
          title: this.post.caption || 'Check out this post!',
          url: window.location.href,
          text: `Posted by ${this.post.user.name}`,
        })
        .catch(() => this.fallbackCopy());
    } else {
      this.fallbackCopy();
    }
  }

  private fallbackCopy(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }

  // Helper: no need anymore, we get type from backend
  // but keep for safety
  getMediaType(url: string): 'image' | 'video' {
    return url.match(/\.(mp4|mov|webm|ogg)$/i) ? 'video' : 'image';
  }
}
