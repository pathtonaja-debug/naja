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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      companion_profiles: {
        Row: {
          behavior_settings: Json | null
          created_at: string | null
          eye_color: string | null
          hair_color: string | null
          id: string
          name: string | null
          outfit: string | null
          skin_tone: string | null
          updated_at: string | null
          user_id: string
          voice_tone: string | null
        }
        Insert: {
          behavior_settings?: Json | null
          created_at?: string | null
          eye_color?: string | null
          hair_color?: string | null
          id?: string
          name?: string | null
          outfit?: string | null
          skin_tone?: string | null
          updated_at?: string | null
          user_id: string
          voice_tone?: string | null
        }
        Update: {
          behavior_settings?: Json | null
          created_at?: string | null
          eye_color?: string | null
          hair_color?: string | null
          id?: string
          name?: string | null
          outfit?: string | null
          skin_tone?: string | null
          updated_at?: string | null
          user_id?: string
          voice_tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companion_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dhikr_sessions: {
        Row: {
          count: number
          created_at: string | null
          date: string | null
          id: string
          phrase: string
          target: number | null
          user_id: string
        }
        Insert: {
          count: number
          created_at?: string | null
          date?: string | null
          id?: string
          phrase: string
          target?: number | null
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string | null
          date?: string | null
          id?: string
          phrase?: string
          target?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dhikr_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      duas: {
        Row: {
          category: string | null
          content: Json
          created_at: string | null
          id: string
          is_favorite: boolean | null
          reminder_time: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: Json
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          reminder_time?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          reminder_time?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          completed: boolean | null
          count: number | null
          created_at: string | null
          date: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          count?: number | null
          created_at?: string | null
          date: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          count?: number | null
          created_at?: string | null
          date?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: string | null
          created_at: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          name: string
          reminder_time: string | null
          target_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reminder_time?: string | null
          target_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reminder_time?: string | null
          target_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          data: Json | null
          id: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_times_cache: {
        Row: {
          created_at: string | null
          date: string
          id: string
          latitude: number
          longitude: number
          method: Database["public"]["Enums"]["prayer_method"]
          times: Json
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          latitude: number
          longitude: number
          method: Database["public"]["Enums"]["prayer_method"]
          times: Json
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          latitude?: number
          longitude?: number
          method?: Database["public"]["Enums"]["prayer_method"]
          times?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          language: string | null
          latitude: number | null
          longitude: number | null
          notifications_enabled: boolean | null
          prayer_method: Database["public"]["Enums"]["prayer_method"] | null
          show_hijri: boolean | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          notifications_enabled?: boolean | null
          prayer_method?: Database["public"]["Enums"]["prayer_method"] | null
          show_hijri?: boolean | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          notifications_enabled?: boolean | null
          prayer_method?: Database["public"]["Enums"]["prayer_method"] | null
          show_hijri?: boolean | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reflections: {
        Row: {
          created_at: string | null
          date: string
          id: string
          photo_url: string | null
          prompt: string | null
          text: string
          updated_at: string | null
          user_id: string
          voice_note_url: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          photo_url?: string | null
          prompt?: string | null
          text: string
          updated_at?: string | null
          user_id: string
          voice_note_url?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          photo_url?: string | null
          prompt?: string | null
          text?: string
          updated_at?: string | null
          user_id?: string
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reflections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      prayer_method:
        | "MWL"
        | "ISNA"
        | "Egypt"
        | "Makkah"
        | "Karachi"
        | "Tehran"
        | "Jafari"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      prayer_method: [
        "MWL",
        "ISNA",
        "Egypt",
        "Makkah",
        "Karachi",
        "Tehran",
        "Jafari",
      ],
    },
  },
} as const
