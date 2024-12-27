export interface FamilyMember {
  id: string;
  name: string;
  birth_date: string;
  partner_id?: string;
  parent_id?: string;
  family_id: string;
}

export interface Family {
  id: string;
  name: string;
  description: string;
  created_at: string;
  plan_id: number;
}

export interface FamilyUser {
  family_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface Plan {
  id: number;
  name: string;
  max_users: number;
  price: number;
}

export interface User {
  id: string;
  email: string;
}

