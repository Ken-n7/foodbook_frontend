import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts'; // change to your API base URL

  constructor(private http: HttpClient) {}

  createPost(formData: FormData): Observable<any> {
    // POST multipart/form-data request to create a post
    return this.http.post(this.apiUrl, formData);
  }
}
