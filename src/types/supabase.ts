export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "super_admin" | "technical_director" | "coach" | "logistics" | "parent" | "player";
          display_name: string;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "super_admin" | "technical_director" | "coach" | "logistics" | "parent" | "player";
          display_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          role?: "super_admin" | "technical_director" | "coach" | "logistics" | "parent" | "player";
          display_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
        };
      };
      players: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          birth_date: string;
          category: "U10_U12" | "U13_U15" | "U16_U18";
          position: "GK" | "DEF" | "MID" | "FWD";
          city: string;
          nationality: string;
          height_cm: number | null;
          weight_kg: number | null;
          strong_foot: "right" | "left" | "both" | null;
          photo_url: string | null;
          bio_fr: string | null;
          bio_en: string | null;
          status: "active" | "inactive" | "on_loan" | "alumni";
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          birth_date: string;
          category: "U10_U12" | "U13_U15" | "U16_U18";
          position: "GK" | "DEF" | "MID" | "FWD";
          city: string;
          nationality: string;
          height_cm?: number | null;
          weight_kg?: number | null;
          strong_foot?: "right" | "left" | "both" | null;
          photo_url?: string | null;
          bio_fr?: string | null;
          bio_en?: string | null;
          status?: "active" | "inactive" | "on_loan" | "alumni";
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          birth_date?: string;
          category?: "U10_U12" | "U13_U15" | "U16_U18";
          position?: "GK" | "DEF" | "MID" | "FWD";
          city?: string;
          nationality?: string;
          height_cm?: number | null;
          weight_kg?: number | null;
          strong_foot?: "right" | "left" | "both" | null;
          photo_url?: string | null;
          bio_fr?: string | null;
          bio_en?: string | null;
          status?: "active" | "inactive" | "on_loan" | "alumni";
          user_id?: string | null;
        };
      };
      coaches: {
        Row: {
          id: string;
          user_id: string;
          role_fr: string;
          role_en: string;
          categories: ("U10_U12" | "U13_U15" | "U16_U18")[];
          certifications: string[];
          bio_fr: string | null;
          bio_en: string | null;
          photo_url: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_fr: string;
          role_en: string;
          categories?: ("U10_U12" | "U13_U15" | "U16_U18")[];
          certifications?: string[];
          bio_fr?: string | null;
          bio_en?: string | null;
          photo_url?: string | null;
        };
        Update: {
          role_fr?: string;
          role_en?: string;
          categories?: ("U10_U12" | "U13_U15" | "U16_U18")[];
          certifications?: string[];
          bio_fr?: string | null;
          bio_en?: string | null;
          photo_url?: string | null;
        };
      };
      evaluation_criteria: {
        Row: {
          id: string;
          pillar: "physical" | "mental" | "behaviour" | "academic" | "technical" | "tactical";
          position_specific: ("GK" | "DEF" | "MID" | "FWD")[] | null;
          name_fr: string;
          name_en: string;
          description_fr: string | null;
          description_en: string | null;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pillar: "physical" | "mental" | "behaviour" | "academic" | "technical" | "tactical";
          position_specific?: ("GK" | "DEF" | "MID" | "FWD")[] | null;
          name_fr: string;
          name_en: string;
          description_fr?: string | null;
          description_en?: string | null;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          pillar?: "physical" | "mental" | "behaviour" | "academic" | "technical" | "tactical";
          position_specific?: ("GK" | "DEF" | "MID" | "FWD")[] | null;
          name_fr?: string;
          name_en?: string;
          description_fr?: string | null;
          description_en?: string | null;
          sort_order?: number;
          active?: boolean;
        };
      };
      player_evaluations: {
        Row: {
          id: string;
          player_id: string;
          coach_id: string;
          type: "weekly" | "monthly" | "semester";
          period_start: string;
          period_end: string;
          general_comment_fr: string | null;
          general_comment_en: string | null;
          objectives_next_period: string | null;
          status: "draft" | "finalised" | "published";
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          coach_id: string;
          type: "weekly" | "monthly" | "semester";
          period_start: string;
          period_end: string;
          general_comment_fr?: string | null;
          general_comment_en?: string | null;
          objectives_next_period?: string | null;
          status?: "draft" | "finalised" | "published";
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          general_comment_fr?: string | null;
          general_comment_en?: string | null;
          objectives_next_period?: string | null;
          status?: "draft" | "finalised" | "published";
          published_at?: string | null;
        };
      };
      evaluation_scores: {
        Row: {
          id: string;
          evaluation_id: string;
          criteria_id: string;
          rating: "developing" | "satisfactory" | "good" | "excellent";
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          evaluation_id: string;
          criteria_id: string;
          rating: "developing" | "satisfactory" | "good" | "excellent";
          comment: string;
          created_at?: string;
        };
        Update: {
          rating?: "developing" | "satisfactory" | "good" | "excellent";
          comment?: string;
        };
      };
      parent_profiles: {
        Row: {
          id: string;
          user_id: string;
          player_id: string;
          relationship: string;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          player_id: string;
          relationship: string;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          relationship?: string;
          verified?: boolean;
        };
      };
      equipment: {
        Row: {
          id: string;
          name: string;
          category: "balls" | "jerseys" | "boots" | "protection" | "medical" | "admin" | "other";
          quantity_total: number;
          quantity_available: number;
          condition: "new" | "good" | "worn" | "out_of_service";
          location: string | null;
          notes: string | null;
          last_checked: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category: "balls" | "jerseys" | "boots" | "protection" | "medical" | "admin" | "other";
          quantity_total: number;
          quantity_available: number;
          condition: "new" | "good" | "worn" | "out_of_service";
          location?: string | null;
          notes?: string | null;
          last_checked?: string | null;
        };
        Update: {
          name?: string;
          category?: "balls" | "jerseys" | "boots" | "protection" | "medical" | "admin" | "other";
          quantity_total?: number;
          quantity_available?: number;
          condition?: "new" | "good" | "worn" | "out_of_service";
          location?: string | null;
          notes?: string | null;
          last_checked?: string | null;
        };
      };
      news_articles: {
        Row: {
          id: string;
          slug: string;
          title_fr: string;
          title_en: string;
          excerpt_fr: string;
          excerpt_en: string;
          body_fr: string;
          body_en: string;
          cover_url: string | null;
          author_id: string;
          published_at: string | null;
          status: "draft" | "published" | "archived";
          tags: string[];
        };
        Insert: {
          id?: string;
          slug: string;
          title_fr: string;
          title_en: string;
          excerpt_fr: string;
          excerpt_en: string;
          body_fr: string;
          body_en: string;
          cover_url?: string | null;
          author_id: string;
          published_at?: string | null;
          status?: "draft" | "published" | "archived";
          tags?: string[];
        };
        Update: {
          slug?: string;
          title_fr?: string;
          title_en?: string;
          excerpt_fr?: string;
          excerpt_en?: string;
          body_fr?: string;
          body_en?: string;
          cover_url?: string | null;
          published_at?: string | null;
          status?: "draft" | "published" | "archived";
          tags?: string[];
        };
      };
      partners: {
        Row: {
          id: string;
          name: string;
          tier: "title" | "official" | "supporter";
          logo_url: string | null;
          website: string | null;
          description_fr: string | null;
          description_en: string | null;
          active: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          tier: "title" | "official" | "supporter";
          logo_url?: string | null;
          website?: string | null;
          description_fr?: string | null;
          description_en?: string | null;
          active?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          tier?: "title" | "official" | "supporter";
          logo_url?: string | null;
          website?: string | null;
          description_fr?: string | null;
          description_en?: string | null;
          active?: boolean;
          sort_order?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
