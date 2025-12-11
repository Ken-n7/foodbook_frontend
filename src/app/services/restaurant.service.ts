import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  // Get all restaurants (be careful if the list is large)
  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.api);
  }

  // Search restaurants by name or query term
  searchRestaurants(term: string): Observable<Restaurant[]> {
    const url = `${this.api}/search?q=${encodeURIComponent(term)}`;
    return this.http.get<Restaurant[]>(url);
  }
}
