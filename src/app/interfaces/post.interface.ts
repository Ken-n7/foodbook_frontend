import { MediaItemInterface } from './media-item.interface';
import { RestaurantInterface } from './restaurant.interface';
import { UserInterface } from "./user.interface";

export interface Post {
  id: number;
  user_id: number;
  restaurant_id: number | null;
  caption: string | null;
  // media_url?: string | string[] | null;     // legacy
  media: MediaItemInterface[];                         // ← this is what you should use now!
  rating: number | null;

  likes_count: number;
  comments_count: number;
  is_liked: boolean;                          // ← NOW COMES FROM BACKEND!

  user: UserInterface;
  restaurant: RestaurantInterface | null;

  created_at: string;
  created_at_human: string;
}
