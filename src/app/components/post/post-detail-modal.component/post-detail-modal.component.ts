import { Component, Input, Output, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../interfaces/post.interface';
import { MediaItemInterface } from '../../../interfaces/media-item.interface';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-detail-modal.component.html',
  styleUrls: ['./post-detail-modal.component.css'],
})
export class PostDetailModalComponent {
  @Input() post!: Post;
  @Output() close = new EventEmitter<void>();

  isTheaterMode = false;
  newComment = '';
  currentMediaIndex = 0;

  constructor(
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {}

  get mediaItems(): MediaItemInterface[] {
    return this.post.media || [];
  }

  get hasMedia(): boolean {
    return this.mediaItems.length > 0;
  }

  get currentMedia(): MediaItemInterface | null {
    return this.mediaItems[this.currentMediaIndex] || null;
  }

  get hasMultipleMedia(): boolean {
    return this.mediaItems.length > 1;
  }

  nextMedia() {
    if (this.currentMediaIndex < this.mediaItems.length - 1) {
      this.currentMediaIndex++;
      this.cdr.detectChanges(); // Ensure UI updates
    }
  }

  prevMedia() {
    if (this.currentMediaIndex > 0) {
      this.currentMediaIndex--;
      this.cdr.detectChanges();
    }
  }

  goToMedia(index: number) {
    this.currentMediaIndex = index;
    this.cdr.detectChanges();
  }

  toggleLike() {
    this.postService.toggleLike(this.post).subscribe({
      next: (res: any) => {
        this.post.is_liked = res.is_liked;
        this.post.likes_count = res.likes_count;
        this.cdr.detectChanges();
      },
    });
  }

  toggleTheaterMode() {
    if (!this.hasMedia) return;
    this.isTheaterMode = !this.isTheaterMode;
    if (this.isTheaterMode) {
      this.currentMediaIndex = 0;
    }
    this.cdr.detectChanges(); // Smooth mode switch
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal') || target.classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isTheaterMode) {
      this.isTheaterMode = false;
    } else {
      this.close.emit();
    }
    this.cdr.detectChanges();
  }

  @HostListener('document:keydown.arrowleft')
  onLeft() {
    if (this.isTheaterMode && this.hasMedia) this.prevMedia();
  }

  @HostListener('document:keydown.arrowright')
  onRight() {
    if (this.isTheaterMode && this.hasMedia) this.nextMedia();
  }

  addComment() {
    if (!this.newComment.trim()) return;
    // TODO: Implement backend connection for comments
    // For now, simulate adding to local (but since no comments array, log)
    console.log('New comment:', this.newComment);
    this.newComment = '';
    this.cdr.detectChanges();
  }
}
