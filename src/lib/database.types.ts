export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          xp: number;
          level: number;
          character_type: string;
          streak_days: number;
          last_active_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          avatar_url?: string | null;
          xp?: number;
          level?: number;
          character_type?: string;
          streak_days?: number;
          last_active_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string | null;
          xp?: number;
          level?: number;
          character_type?: string;
          streak_days?: number;
          last_active_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quests: {
        Row: {
          id: string;
          user_id: string;
          goal: string;
          duration: string;
          custom_date: string | null;
          deadline_hour: string;
          deadline_period: string;
          status: string;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal: string;
          duration: string;
          custom_date?: string | null;
          deadline_hour?: string;
          deadline_period?: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal?: string;
          duration?: string;
          custom_date?: string | null;
          deadline_hour?: string;
          deadline_period?: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      quest_items: {
        Row: {
          id: string;
          quest_id: string;
          user_id: string;
          text: string;
          completed: boolean;
          xp_earned: number;
          order_index: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          quest_id: string;
          user_id: string;
          text: string;
          completed?: boolean;
          xp_earned?: number;
          order_index?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          quest_id?: string;
          user_id?: string;
          text?: string;
          completed?: boolean;
          xp_earned?: number;
          order_index?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      daily_quest_logs: {
        Row: {
          id: string;
          user_id: string;
          quest_id: number;
          completed_date: string;
          xp_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quest_id: number;
          completed_date: string;
          xp_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quest_id?: number;
          completed_date?: string;
          xp_earned?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
