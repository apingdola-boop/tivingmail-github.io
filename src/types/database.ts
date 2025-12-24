export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          google_access_token: string | null;
          google_refresh_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          google_access_token?: string | null;
          google_refresh_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          google_access_token?: string | null;
          google_refresh_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          original_email_subject: string;
          original_email_from: string;
          original_email_date: string;
          original_email_body: string;
          discount_amount: string | null;
          discount_code: string | null;
          expiry_date: string | null;
          category: string;
          is_public: boolean;
          likes_count: number;
          views_count: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          original_email_subject: string;
          original_email_from: string;
          original_email_date: string;
          original_email_body: string;
          discount_amount?: string | null;
          discount_code?: string | null;
          expiry_date?: string | null;
          category?: string;
          is_public?: boolean;
          likes_count?: number;
          views_count?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          original_email_subject?: string;
          original_email_from?: string;
          original_email_date?: string;
          original_email_body?: string;
          discount_amount?: string | null;
          discount_code?: string | null;
          expiry_date?: string | null;
          category?: string;
          is_public?: boolean;
          likes_count?: number;
          views_count?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          deal_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          deal_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          deal_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type Deal = Database['public']['Tables']['deals']['Row'];
export type Like = Database['public']['Tables']['likes']['Row'];

export type DealWithUser = Deal & {
  user: Pick<User, 'id' | 'name' | 'avatar_url'>;
};





