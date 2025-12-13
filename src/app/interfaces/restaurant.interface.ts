export interface RestaurantInterface {
id: number;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;

  average_rating: number;
  ratings_count: number;
  posts_count?: number;
}
