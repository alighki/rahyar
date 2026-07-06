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
      badges: {
        Row: {
          category: string
          description_ar: string
          description_fa: string
          icon: string
          id: string
          name_ar: string
          name_fa: string
          xp_required: number
        }
        project_submissions: {
  Row: {
    id: string
    user_id: string
    title: string
    description: string
    created_at: string
  }
  Insert: {
    user_id: string
    title: string
    description: string
  }
  Update: {
    title?: string
    description?: string
  }
  Relationships: [
    {
      foreignKeyName: "project_submissions_user_id_fkey"
      columns: ["user_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}
        Insert: {
          category?: string
          description_ar?: string
          description_fa?: string
          icon?: string
          id?: string
          name_ar?: string
          name_fa: string
          xp_required?: number
        }
        Update: {
          category?: string
          description_ar?: string
          description_fa?: string
          icon?: string
          id?: string
          name_ar?: string
          name_fa?: string
          xp_required?: number
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      leaderboard_weekly: {
        Row: {
          id: string
          rank: number | null
          user_id: string
          week_start: string
          xp_earned: number
        }
        Insert: {
          id?: string
          rank?: number | null
          user_id: string
          week_start: string
          xp_earned?: number
        }
        Update: {
          id?: string
          rank?: number | null
          user_id?: string
          week_start?: string
          xp_earned?: number
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          created_at: string
          id: string
          progress_percent: number
          skills: Json
          status: string
          title_fa: string
          updated_at: string
          user_id: string
          weeks: Json
        }
        Insert: {
          created_at?: string
          id?: string
          progress_percent?: number
          skills?: Json
          status?: string
          title_fa?: string
          updated_at?: string
          user_id: string
          weeks?: Json
        }
        Update: {
          created_at?: string
          id?: string
          progress_percent?: number
          skills?: Json
          status?: string
          title_fa?: string
          updated_at?: string
          user_id?: string
          weeks?: Json
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          grade: number
          id: string
          level: number
          locale: string
          theme: string
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          grade?: number
          id?: string
          level?: number
          locale?: string
          theme?: string
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          grade?: number
          id?: string
          level?: number
          locale?: string
          theme?: string
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string
          correct_answers: number
          id: string
          quiz_id: string
          score: number
          skill_analysis: Json
          time_spent_seconds: number
          total_questions: number
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string
          correct_answers?: number
          id?: string
          quiz_id: string
          score?: number
          skill_analysis?: Json
          time_spent_seconds?: number
          total_questions?: number
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          correct_answers?: number
          id?: string
          quiz_id?: string
          score?: number
          skill_analysis?: Json
          time_spent_seconds?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: number
          explanation_ar: string
          explanation_fa: string
          id: string
          options: Json
          question_ar: string
          question_fa: string
          quiz_id: string
          skill_tag: string
          sort_order: number
        }
        Insert: {
          correct_answer?: number
          explanation_ar?: string
          explanation_fa?: string
          id?: string
          options?: Json
          question_ar?: string
          question_fa: string
          quiz_id: string
          skill_tag?: string
          sort_order?: number
        }
        Update: {
          correct_answer?: number
          explanation_ar?: string
          explanation_fa?: string
          id?: string
          options?: Json
          question_ar?: string
          question_fa?: string
          quiz_id?: string
          skill_tag?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          category: string
          created_at: string
          description_ar: string
          description_fa: string
          difficulty: string
          grade: number
          id: string
          is_active: boolean
          time_limit_minutes: number
          title_ar: string
          title_fa: string
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description_ar?: string
          description_fa?: string
          difficulty?: string
          grade?: number
          id?: string
          is_active?: boolean
          time_limit_minutes?: number
          title_ar?: string
          title_fa: string
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description_ar?: string
          description_fa?: string
          difficulty?: string
          grade?: number
          id?: string
          is_active?: boolean
          time_limit_minutes?: number
          title_ar?: string
          title_fa?: string
          xp_reward?: number
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          content_ar: string | null
          content_fa: string | null
          created_at: string
          description_ar: string
          description_fa: string
          grade: number
          id: string
          is_active: boolean
          sort_order: number
          title_ar: string
          title_fa: string
          type: string
          url: string | null
        }
        Insert: {
          category?: string
          content_ar?: string | null
          content_fa?: string | null
          created_at?: string
          description_ar?: string
          description_fa?: string
          grade?: number
          id?: string
          is_active?: boolean
          sort_order?: number
          title_ar?: string
          title_fa: string
          type?: string
          url?: string | null
        }
        Update: {
          category?: string
          content_ar?: string | null
          content_fa?: string | null
          created_at?: string
          description_ar?: string
          description_fa?: string
          grade?: number
          id?: string
          is_active?: boolean
          sort_order?: number
          title_ar?: string
          title_fa?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      video_links: {
        Row: {
          aparat_url: string
          category: string
          created_at: string
          duration_minutes: number | null
          grade: number
          id: string
          sort_order: number
          thumbnail_url: string | null
          title_ar: string
          title_fa: string
        }
        Insert: {
          aparat_url: string
          category?: string
          created_at?: string
          duration_minutes?: number | null
          grade?: number
          id?: string
          sort_order?: number
          thumbnail_url?: string | null
          title_ar?: string
          title_fa: string
        }
        Update: {
          aparat_url?: string
          category?: string
          created_at?: string
          duration_minutes?: number | null
          grade?: number
          id?: string
          sort_order?: number
          thumbnail_url?: string | null
          title_ar?: string
          title_fa?: string
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          source_id: string | null
          source_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          source_id?: string | null
          source_type?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          source_id?: string | null
          source_type?: string
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
