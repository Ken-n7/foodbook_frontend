import { RouterLink } from '@angular/router';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ComponentRef,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../interfaces/post.interface';
import { PostService } from '../../../services/post.service';
import { PostDetailModalComponent } from '../../post/post-detail-modal.component/post-detail-modal.component';
// import { AuthService } from '../../../auth/auth.service';
// import { ProfilePicture } from '../../shared/profile-picture/profile-picture';

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
  // @Input() yourUserId!: number;
  @Input() currentUserId: number | null = null;
  @Output() deleted = new EventEmitter<number>();

  constructor(
    private postService: PostService,
    private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    // private authService: AuthService
  ) {
    // this.authService.user$.subscribe(user => {
    //   this.currentUserId = user?.id ?? null;
    // });
  }

  private modalRef?: ComponentRef<PostDetailModalComponent>;

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

  onComment(post: Post): void {
    this.openDetail(post); // Reuse the detail modal for comments too
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

  // FIXED: Properly open the modal
  openDetail(post: Post) {
    // Clear any existing modal
    if (this.modalRef) {
      this.modalRef.instance.close.emit();
    }

    // Create the modal component dynamically
    this.modalRef = this.viewContainerRef.createComponent(PostDetailModalComponent);

    // Pass the post data
    this.modalRef.instance.post = post;

    // Listen to close event and destroy
    this.modalRef.instance.close.subscribe(() => {
      this.modalRef?.destroy();
      this.modalRef = undefined;
    });
  }

  private fallbackCopy(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }

  editPost(post: Post) {
    console.log('Edit post', post.id);
    // Implement your edit logic or open edit modal here
  }

  deletePost(post: Post): void {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    this.postService.deletePost(post.id).subscribe({
      next: () => {
        alert('Post deleted successfully.');
        this.deleted.emit(post.id); // notify parent component
      },
      error: () => {
        alert('Failed to delete the post. Please try again.');
      },
    });
  }

  reportPost(post: Post) {
    console.log('Report post', post.id);
    // No function for now, just a placeholder
  }

  // Helper: no need anymore, we get type from backend
  // but keep for safety
  getMediaType(url: string): 'image' | 'video' {
    return url.match(/\.(mp4|mov|webm|ogg)$/i) ? 'video' : 'image';
  }
}
