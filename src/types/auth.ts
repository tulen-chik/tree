export interface User {
  id: string;
  email: string;
  role_id: number;
  is_activated: boolean;
  activation_link: string;
}

export interface Token {
  id: string;
  user_id: string;
  refresh_token: string;
  token: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
}

