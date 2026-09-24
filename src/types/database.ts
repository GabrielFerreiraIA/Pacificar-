// Gerado pela API do Supabase a partir do schema. Não edite à mão: regenere após cada migration.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      anamneses: {
        Row: {
          answers: Json
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anamneses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          bloating_level: number | null
          bristol_type: number | null
          created_at: string
          day_number: number
          diet_compliance: string | null
          energy_rating: number | null
          id: string
          journal_notes: string
          self_care_done: boolean
          sleep_quality: number | null
          sweet_craving: number | null
          tongue_scraping_done: boolean
          updated_at: string
          user_id: string
          warm_water_done: boolean
          water_intake: string | null
          zeolite_taken: boolean
        }
        Insert: {
          bloating_level?: number | null
          bristol_type?: number | null
          created_at?: string
          day_number: number
          diet_compliance?: string | null
          energy_rating?: number | null
          id?: string
          journal_notes?: string
          self_care_done?: boolean
          sleep_quality?: number | null
          sweet_craving?: number | null
          tongue_scraping_done?: boolean
          updated_at?: string
          user_id: string
          warm_water_done?: boolean
          water_intake?: string | null
          zeolite_taken?: boolean
        }
        Update: {
          bloating_level?: number | null
          bristol_type?: number | null
          created_at?: string
          day_number?: number
          diet_compliance?: string | null
          energy_rating?: number | null
          id?: string
          journal_notes?: string
          self_care_done?: boolean
          sleep_quality?: number | null
          sweet_craving?: number | null
          tongue_scraping_done?: boolean
          updated_at?: string
          user_id?: string
          warm_water_done?: boolean
          water_intake?: string | null
          zeolite_taken?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          accepted_at: string
          term_version: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          term_version: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          term_version?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dosha_results: {
        Row: {
          answers: Json
          created_at: string
          id: string
          kapha: number | null
          pitta: number | null
          result: string | null
          user_id: string
          vata: number | null
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          kapha?: number | null
          pitta?: number | null
          result?: string | null
          user_id: string
          vata?: number | null
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          kapha?: number | null
          pitta?: number | null
          result?: string | null
          user_id?: string
          vata?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dosha_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      heartbeat: {
        Row: {
          created_at: string
          id: number
          source: string
        }
        Insert: {
          created_at?: string
          id?: never
          source: string
        }
        Update: {
          created_at?: string
          id?: never
          source?: string
        }
        Relationships: []
      }
      lab_exams: {
        Row: {
          category: string | null
          created_at: string
          exam_date: string | null
          file_name: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          tags: string[]
          therapist_notes: string | null
          therapist_reviewed: boolean
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          exam_date?: string | null
          file_name: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          tags?: string[]
          therapist_notes?: string | null
          therapist_reviewed?: boolean
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          exam_date?: string | null
          file_name?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          tags?: string[]
          therapist_notes?: string | null
          therapist_reviewed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_exams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parasite_cycles: {
        Row: {
          charcoal_taken: boolean
          completed: boolean
          cycle_number: number
          day1_completed: boolean
          day2_completed: boolean
          day3_completed: boolean
          h2o2_taken: boolean
          id: string
          moon_date: string | null
          moon_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          charcoal_taken?: boolean
          completed?: boolean
          cycle_number: number
          day1_completed?: boolean
          day2_completed?: boolean
          day3_completed?: boolean
          h2o2_taken?: boolean
          id?: string
          moon_date?: string | null
          moon_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          charcoal_taken?: boolean
          completed?: boolean
          cycle_number?: number
          day1_completed?: boolean
          day2_completed?: boolean
          day3_completed?: boolean
          h2o2_taken?: boolean
          id?: string
          moon_date?: string | null
          moon_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parasite_cycles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      preparo_checked: {
        Row: {
          created_at: string
          item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          item_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preparo_checked_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          aromatherapy_oils: string[]
          carrier_oil: string | null
          created_at: string
          created_by: string | null
          dosha_predominant: string | null
          id: string
          massala_recommended: string | null
          supplements_recommended: Json
          therapeutic_teas: string[]
          therapist_notes: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aromatherapy_oils?: string[]
          carrier_oil?: string | null
          created_at?: string
          created_by?: string | null
          dosha_predominant?: string | null
          id?: string
          massala_recommended?: string | null
          supplements_recommended?: Json
          therapeutic_teas?: string[]
          therapist_notes?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aromatherapy_oils?: string[]
          carrier_oil?: string | null
          created_at?: string
          created_by?: string | null
          dosha_predominant?: string | null
          id?: string
          massala_recommended?: string | null
          supplements_recommended?: Json
          therapeutic_teas?: string[]
          therapist_notes?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_status: string
          age: number | null
          avatar_url: string | null
          created_at: string
          current_day: number
          email: string | null
          full_name: string
          height: number | null
          id: string
          journey_start_date: string | null
          kiwify_order_id: string | null
          phone: string | null
          role: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          access_status?: string
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          current_day?: number
          email?: string | null
          full_name?: string
          height?: number | null
          id: string
          journey_start_date?: string | null
          kiwify_order_id?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          access_status?: string
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          current_day?: number
          email?: string | null
          full_name?: string
          height?: number | null
          id?: string
          journey_start_date?: string | null
          kiwify_order_id?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          created_at: string
          email: string | null
          error: string | null
          event: string
          id: number
          order_id: string
          payload: Json | null
          processed_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          error?: string | null
          event: string
          id?: never
          order_id: string
          payload?: Json | null
          processed_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          error?: string | null
          event?: string
          id?: never
          order_id?: string
          payload?: Json | null
          processed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zeolite_days: {
        Row: {
          created_at: string
          day: number
          user_id: string
        }
        Insert: {
          created_at?: string
          day: number
          user_id: string
        }
        Update: {
          created_at?: string
          day?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zeolite_days_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
