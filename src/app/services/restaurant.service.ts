import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private api = 'http://localhost:8080/api/restaurants';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.api);
  }

  // Fixed version
  searchRestaurants(term: string): Observable<Restaurant[]> {
    if (!term.trim()) {
      return of([]); // Return empty array if no search term
    }

    const url = `${this.api}/search?q=${encodeURIComponent(term)}`;

    return this.http.get<any>(url).pipe(
      tap(response => console.log('Raw API response:', response)),// ← Add this
      map((response) => {
        // Adjust this line based on your actual API response structure
        return response.data || response.results || response || [];
      }),
      catchError((error) => {
        console.error('Error searching restaurants:', error);
        return of([]); // Return empty array on error
      })
    );
  }
}
