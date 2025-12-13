import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserInterface } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<UserInterface | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get user by ID
   */
  getUser(id: number): Observable<UserInterface> {
    console.log('lol');
    return this.http.get<{ data: UserInterface }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${environment.apiUrl}/user`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Update user profile
   */
  updateUser(id: number, userData: Partial<UserInterface>): Observable<UserInterface> {
    return this.http.put<UserInterface>(`${this.apiUrl}/${id}`, userData);
  }

  /**
   * Update user with FormData (for file uploads like profile picture)
   */
  updateUserWithFiles(id: number, formData: FormData): Observable<UserInterface> {
    return this.http.post<UserInterface>(`${this.apiUrl}/${id}?_method=PUT`, formData);
  }

  /**
   * Delete user account
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Follow a user
   */
  followUser(userId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/friends`, {
      friend_id: userId
    });
  }

  /**
   * Unfollow a user
   */
  unfollowUser(friendshipId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/friends/${friendshipId}`);
  }

  /**
   * Check if current user is following another user
   */
  isFollowing(userId: number): Observable<{ is_following: boolean; friendship_id?: number }> {
    return this.http.get<{ is_following: boolean; friendship_id?: number }>(
      `${environment.apiUrl}/friends/check/${userId}`
    );
  }

  /**
   * Get user's followers
   */
  getFollowers(userId: number): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.apiUrl}/${userId}/followers`);
  }

  /**
   * Get users that this user is following
   */
  getFollowing(userId: number): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.apiUrl}/${userId}/following`);
  }

  /**
   * Search users by name
   */
  searchUsers(query: string): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  /**
   * Get current user value (synchronous)
   */
  get currentUserValue(): UserInterface | null {
    return this.currentUserSubject.value;
  }

  /**
   * Clear current user (for logout)
   */
  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}
