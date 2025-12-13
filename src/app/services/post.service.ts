import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post.interface';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private api = 'http://localhost:8080/api/posts';

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

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${postId}`);
  }


  getUserPosts(userId: number) {
    return this.http.get<{ data: Post[] }>(`http://localhost:8080/api/users/${userId}/posts`).pipe(
      map((response) => response.data) // <-- Extract array here
    );
  }

  toggleLike(post: Post): Observable<any> {
    return this.http.post(`${this.api}/${post.id}/toggle-like`, {});
  }
}
