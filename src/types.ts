export type UserRole = 'admin' | 'moderator' | 'member';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  member_type: 'executive' | 'general';
  gender: 'male' | 'female' | 'other';
  department: string;
  batch: string;
  student_id: string;
  avatar_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'notice' | 'event';
  image_url?: string;
  author_id: string;
  created_at: string;
  event_date?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  trx_id: string;
  month: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface ClubSettings {
  id: string;
  monthly_fee: number;
  bkash_number: string;
  updated_at: string;
}
