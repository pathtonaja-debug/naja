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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number
        }
        Relationships: []
      }
      calendar_items: {
        Row: {
          calendar_source: string | null
          category: string
          color: string | null
          completion: number | null
          created_at: string
          device_id: string | null
          end_date_time: string | null
          id: string
          is_all_day: boolean | null
          notes: string | null
          reminder: string | null
          repeat_rule: string | null
          start_date_time: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calendar_source?: string | null
          category: string
          color?: string | null
          completion?: number | null
          created_at?: string
          device_id?: string | null
          end_date_time?: string | null
          id?: string
          is_all_day?: boolean | null
          notes?: string | null
          reminder?: string | null
          repeat_rule?: string | null
          start_date_time: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calendar_source?: string | null
          category?: string
          color?: string | null
          completion?: number | null
          created_at?: string
          device_id?: string | null
          end_date_time?: string | null
          id?: string
          is_all_day?: boolean | null
          notes?: string | null
          reminder?: string | null
          repeat_rule?: string | null
          start_date_time?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companion_profiles: {
        Row: {
          appearance: Json | null
          behavior_settings: Json | null
          created_at: string | null
          device_id: string | null
          eye_color: string | null
          full_body_url: string | null
          hair_color: string | null
          id: string
          name: string | null
          outfit: string | null
          portrait_crop: Json | null
          portrait_url: string | null
          selected_variant_id: number | null
          skin_tone: string | null
          updated_at: string | null
          user_id: string | null
          voice_tone: string | null
        }
        Insert: {
          appearance?: Json | null
          behavior_settings?: Json | null
          created_at?: string | null
          device_id?: string | null
          eye_color?: string | null
          full_body_url?: string | null
          hair_color?: string | null
          id?: string
          name?: string | null
          outfit?: string | null
          portrait_crop?: Json | null
          portrait_url?: string | null
          selected_variant_id?: number | null
          skin_tone?: string | null
          updated_at?: string | null
          user_id?: string | null
          voice_tone?: string | null
        }
        Update: {
          appearance?: Json | null
          behavior_settings?: Json | null
          created_at?: string | null
          device_id?: string | null
          eye_color?: string | null
          full_body_url?: string | null
          hair_color?: string | null
          id?: string
          name?: string | null
          outfit?: string | null
          portrait_crop?: Json | null
          portrait_url?: string | null
          selected_variant_id?: number | null
          skin_tone?: string | null
          updated_at?: string | null
          user_id?: string | null
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
      daily_quizzes: {
        Row: {
          created_at: string
          id: string
          questions: Json
          quiz_date: string
          topic: string
        }
        Insert: {
          created_at?: string
          id?: string
          questions: Json
          quiz_date: string
          topic: string
        }
        Update: {
          created_at?: string
          id?: string
          questions?: Json
          quiz_date?: string
          topic?: string
        }
        Relationships: []
      }
      dhikr_sessions: {
        Row: {
          count: number
          created_at: string | null
          date: string | null
          device_id: string | null
          id: string
          phrase: string
          target: number | null
          user_id: string
        }
        Insert: {
          count: number
          created_at?: string | null
          date?: string | null
          device_id?: string | null
          id?: string
          phrase: string
          target?: number | null
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string | null
          date?: string | null
          device_id?: string | null
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
      dua_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dua_folders_user_id_fkey"
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
          device_id: string | null
          final_text: string | null
          folder_id: string | null
          id: string
          include_salawat: boolean | null
          is_favorite: boolean | null
          reminder_time: string | null
          request_text: string | null
          selected_names: string[] | null
          title: string
          topic: string | null
          ummah_prayers: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: Json
          created_at?: string | null
          device_id?: string | null
          final_text?: string | null
          folder_id?: string | null
          id?: string
          include_salawat?: boolean | null
          is_favorite?: boolean | null
          reminder_time?: string | null
          request_text?: string | null
          selected_names?: string[] | null
          title: string
          topic?: string | null
          ummah_prayers?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string | null
          device_id?: string | null
          final_text?: string | null
          folder_id?: string | null
          id?: string
          include_salawat?: boolean | null
          is_favorite?: boolean | null
          reminder_time?: string | null
          request_text?: string | null
          selected_names?: string[] | null
          title?: string
          topic?: string | null
          ummah_prayers?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duas_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "dua_folders"
            referencedColumns: ["id"]
          },
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
          device_id: string | null
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          count?: number | null
          created_at?: string | null
          date: string
          device_id?: string | null
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          count?: number | null
          created_at?: string | null
          date?: string
          device_id?: string | null
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
      habit_stats: {
        Row: {
          created_at: string | null
          current_streak: number | null
          device_id: string | null
          habit_id: string
          id: string
          last_completed_date: string | null
          longest_streak: number | null
          monthly_breakdown: Json | null
          total_completions: number | null
          updated_at: string | null
          user_id: string
          weekly_breakdown: Json | null
          yearly_breakdown: Json | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          device_id?: string | null
          habit_id: string
          id?: string
          last_completed_date?: string | null
          longest_streak?: number | null
          monthly_breakdown?: Json | null
          total_completions?: number | null
          updated_at?: string | null
          user_id: string
          weekly_breakdown?: Json | null
          yearly_breakdown?: Json | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          device_id?: string | null
          habit_id?: string
          id?: string
          last_completed_date?: string | null
          longest_streak?: number | null
          monthly_breakdown?: Json | null
          total_completions?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_breakdown?: Json | null
          yearly_breakdown?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_stats_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: true
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          device_id: string | null
          frequency: string | null
          habit_time: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_all_day: boolean | null
          name: string
          notes: string | null
          reminder_time: string | null
          repeat_pattern: Json | null
          sync_to_calendar: boolean | null
          target_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          device_id?: string | null
          frequency?: string | null
          habit_time?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_all_day?: boolean | null
          name: string
          notes?: string | null
          reminder_time?: string | null
          repeat_pattern?: Json | null
          sync_to_calendar?: boolean | null
          target_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          device_id?: string | null
          frequency?: string | null
          habit_time?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_all_day?: boolean | null
          name?: string
          notes?: string | null
          reminder_time?: string | null
          repeat_pattern?: Json | null
          sync_to_calendar?: boolean | null
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
          city: string | null
          country: string | null
          created_at: string | null
          device_id: string | null
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
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_id?: string | null
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
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_id?: string | null
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
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          quiz_id: string
          score: number
          total_questions: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          answers: Json
          completed_at?: string
          id?: string
          quiz_id: string
          score: number
          total_questions: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          quiz_id?: string
          score?: number
          total_questions?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "daily_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reflections: {
        Row: {
          created_at: string | null
          date: string
          device_id: string | null
          id: string
          mood: string | null
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
          device_id?: string | null
          id?: string
          mood?: string | null
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
          device_id?: string | null
          id?: string
          mood?: string | null
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
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification: {
        Row: {
          created_at: string
          id: string
          last_activity_date: string | null
          level: number
          streak_days: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
