export interface UserInterface {
id: number;
  name: string;
  email?: string;                     // only returned when viewing own profile
  profile_picture: string;            // always full URL (either storage/ or ui-avatars)
  bio: string | null;
  is_admin: boolean;

  posts_count?: number;
  followers_count?: number;
  following_count?: number;

  created_at_human?: string;
}
