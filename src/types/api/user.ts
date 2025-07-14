export interface User {
  user_id: number;
  username: string;
  email: string | null;
  created_at: string;
  auth_user_id: string;
}
