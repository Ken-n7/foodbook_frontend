import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PaginatedResponse } from '../interfaces/post.interface';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly api = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  getPosts(page = 1): Observable<PaginatedResponse<Post>> {
    return this.http.get<PaginatedResponse<Post>>(`${this.api}?page=${page}`);
  }

  createPost(formData: FormData): Observable<Post> {
    return this.http.post<Post>(this.api, formData);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.api}/${id}`);
  }

  // post.service.ts
  toggleLike(post: Post): Observable<any> {
    console.log('Toggling like for post', post.id, 'currently:', post.is_liked);
    return this.http.post(`${this.api}/${post.id}/toggle-like`, {});
  }
}
