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
      plans: {
        Row: {
          id: string;
          plan_key: string;
          name: string;
          monthly_price_cents: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_key: string;
          name: string;
          monthly_price_cents?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plan_key?: string;
          name?: string;
          monthly_price_cents?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: string;
          started_at: string;
          current_period_end: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: string;
          started_at?: string;
          current_period_end?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          status?: string;
          started_at?: string;
          current_period_end?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      payments: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          amount_cents: number;
          currency: string;
          status: string;
          payment_date: string;
          provider: string | null;
          provider_payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          amount_cents?: number;
          currency?: string;
          status?: string;
          payment_date?: string;
          provider?: string | null;
          provider_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          amount_cents?: number;
          currency?: string;
          status?: string;
          payment_date?: string;
          provider?: string | null;
          provider_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          level: string;
          is_read: boolean;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          message: string;
          level?: string;
          is_read?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          level?: string;
          is_read?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
      };

      profiles: {
        Row: {
          id: string;
          subscription_status: string;
          remaining_trials: number;
          created_at: string;
          updated_at: string;
          whatsapp_number: string | null;
          plan_type: string | null;
          trial_expiry: string | null;
          full_name: string | null;
          status: string;
          last_active_at: string | null;
          total_analyses_done: number;
        };
        Insert: {
          id: string;
          subscription_status?: string;
          remaining_trials?: number;
          created_at?: string;
          updated_at?: string;
          whatsapp_number?: string | null;
          plan_type?: string | null;
          trial_expiry?: string | null;
          full_name?: string | null;
          status?: string;
          last_active_at?: string | null;
          total_analyses_done?: number;
        };
        Update: {
          id?: string;
          subscription_status?: string;
          remaining_trials?: number;
          created_at?: string;
          updated_at?: string;
          whatsapp_number?: string | null;
          plan_type?: string | null;
          trial_expiry?: string | null;
          full_name?: string | null;
          status?: string;
          last_active_at?: string | null;
          total_analyses_done?: number;
        };
      };

      reports: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          product_name: string;
          market_data: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          product_name: string;
          market_data: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          product_name?: string;
          market_data?: Json;
        };
      };
    };
  };
}



