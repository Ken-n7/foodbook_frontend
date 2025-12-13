import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostCardComponent } from '../../../components/post/post-card.component/post-card.component';
import { UserInterface } from '../../../interfaces/user.interface';
import { Post } from '../../../interfaces/post.interface';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: UserInterface | null = null;
  posts: Post[] = [];
  isLoading = true;
  activeTab: 'posts' | 'about' | 'photos' = 'posts';
  isOwnProfile = false;
  isFollowing = false;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.currentUserId = user?.id ?? null;
      console.log('user id', this.currentUserId);
      this.checkIfOwnProfile();
    });

    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserProfile(+userId);
      this.loadUserPosts(+userId);
    }
  }

  loadUserProfile(userId: number) {
    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.user = user;
        // this.isLoading = false;
        // Check if viewing own profile
        this.checkIfOwnProfile();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        // this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  loadUserPosts(userId: number) {
    this.postService.getUserPosts(userId).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  onPostDeleted(postId: number) {
    this.posts = this.posts.filter((post) => post.id !== postId);
  }

  checkIfOwnProfile() {
    if (!this.user || this.currentUserId === null) {
      this.isOwnProfile = false;
      return;
    }

    this.isOwnProfile = this.user.id === this.currentUserId;
  }

  setActiveTab(tab: 'posts' | 'about' | 'photos') {
    this.activeTab = tab;
  }

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
    // Call follow/unfollow API here
  }

  editProfile() {
    // Navigate to edit profile page
  }

  uploadCover() {
    // Handle cover photo upload
  }

  uploadProfilePicture() {
    // Handle profile picture upload
  }
}
