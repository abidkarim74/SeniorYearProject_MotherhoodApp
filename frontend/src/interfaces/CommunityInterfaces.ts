export type PostType = "Advice" | "Discussion" | "Support";

export interface User {
  firstname: string;
  lastname: string;
  username: string;
  profile_pic: string;
}

export interface Post {
  user_id: string;
  user: User;
  title: string;
  tags: string[];
  images: string[];
  description: string;
  post_type: PostType;
  id: string;
  visible: boolean;
  post_category: string;
  like_count: number;
  created_at: string;
}

export interface PostFormData {
  title: string;
  description: string;
  post_type: PostType;
  tags: string[];
  images: string[];
}