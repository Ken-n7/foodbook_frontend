// src/app/interfaces/post.interface.ts

export interface User {
  id: number;
  name: string;
  profile_picture: string;
  bio: string | null;
  posts_count?: number;
  followers_count?: number;
  following_count?: number;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  average_rating: number;
  ratings_count: number;
  posts_count?: number;
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface Post {
  id: number;
  user_id: number;
  restaurant_id: number | null;
  caption: string | null;
  // media_url?: string | string[] | null;     // legacy
  media: MediaItem[];                         // ← this is what you should use now!
  rating: number | null;

  likes_count: number;
  comments_count: number;
  is_liked: boolean;                          // ← NOW COMES FROM BACKEND!

  user: User;
  restaurant: Restaurant | null;

  created_at: string;
  created_at_human: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
