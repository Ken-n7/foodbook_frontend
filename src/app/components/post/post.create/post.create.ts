import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { RestaurantService, Restaurant } from '../../../services/restaurant.service';
import { PostService } from '../../../services/post.service';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-create-post',
  templateUrl: './post.create.html',
  styleUrls: ['./post.create.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class CreatePostComponent implements OnInit {
  form!: FormGroup;

  // Observable list of restaurants for autocomplete
  filteredRestaurants$!: Observable<Restaurant[]>;

  private searchTerms = new Subject<string>();

  mediaPreviews: string[] = [];
  mediaFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Setup restaurant search observable stream
    this.filteredRestaurants$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => (term ? this.restaurantService.searchRestaurants(term) : of([]))),
      catchError(() => of([]))
    );

    this.form.valueChanges.subscribe(() => this.validateContentOrMedia());
  }

  private initForm(): void {
    this.form = this.fb.group({
      content: [''],
      restaurant_id: [''],
      rating: [0],
      media: [null],
      restaurant_search: [''],
    });
  }

  // Typed getters to avoid nullable issues
  get content(): FormControl {
    return this.form.get('content') as FormControl;
  }

  get media(): FormControl {
    return this.form.get('media') as FormControl;
  }

  get restaurantId(): FormControl {
    return this.form.get('restaurant_id') as FormControl;
  }

  get rating(): FormControl {
    return this.form.get('rating') as FormControl;
  }

  get restaurantSearchControl(): FormControl {
    return this.form.get('restaurant_search') as FormControl;
  }

  // Emit search terms as user types
  onSearchTermChange(term: string): void {
    this.searchTerms.next(term);
  }

  // User selects a restaurant from autocomplete list
  selectRestaurant(restaurant: Restaurant): void {
    this.restaurantId.setValue(restaurant.id);
    this.restaurantSearchControl.setValue(restaurant.name, { emitEvent: false });
  }

  private validateContentOrMedia(): void {
    const hasContent = this.content.value?.trim().length > 0;
    const hasMedia = this.mediaFiles.length > 0;

    if (!hasContent && !hasMedia) {
      this.media.setErrors({ required: true });
    } else {
      this.media.setErrors(null);
    }
  }

  onMediaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.mediaFiles = [];
    this.mediaPreviews = [];

    Array.from(input.files).forEach((file) => {
      this.mediaFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.mediaPreviews.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });

    this.media.setValue(this.mediaFiles.length > 0 ? this.mediaFiles : null);
    this.validateContentOrMedia();
  }

  removeMedia(index: number): void {
    if (index < 0 || index >= this.mediaFiles.length) return;

    this.mediaFiles.splice(index, 1);
    this.mediaPreviews.splice(index, 1);

    if (this.mediaFiles.length === 0 && !this.content.value?.trim()) {
      this.media.setErrors({ required: true });
    } else {
      this.media.setErrors(null);
    }
  }

  setRating(star: number): void {
    this.rating.setValue(star);
  }

  submit(): void {
    if (this.form.invalid) {
      alert('Please add some content or upload media.');
      return;
    }

    const formData = new FormData();
    formData.append('content', this.content.value || '');
    formData.append('restaurant_id', this.restaurantId.value || '');
    formData.append('rating', (this.rating.value ?? 0).toString());

    this.mediaFiles.forEach((file) => formData.append('media[]', file));

    this.postService.createPost(formData).subscribe({
      next: () => {
        alert('Post created successfully!');
        this.form.reset();
        this.mediaFiles = [];
        this.mediaPreviews = [];
      },
      error: (error) => {
        console.error('Failed to create post:', error);
        alert('Failed to create post. Please try again.');
      },
    });
  }
}
