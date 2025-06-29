export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          ads_txt: string | null
          adsense_code: string | null
          analytics_code: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          ads_txt?: string | null
          adsense_code?: string | null
          analytics_code?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          ads_txt?: string | null
          adsense_code?: string | null
          analytics_code?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      plant_reminders: {
        Row: {
          created_at: string
          id: string
          interval_days: number
          last_completed: string
          next_due_date: string
          notes: string | null
          plant_id: string | null
          reminder_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interval_days?: number
          last_completed?: string
          next_due_date: string
          notes?: string | null
          plant_id?: string | null
          reminder_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interval_days?: number
          last_completed?: string
          next_due_date?: string
          notes?: string | null
          plant_id?: string | null
          reminder_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plant_reminders_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "user_plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_species: {
        Row: {
          created_at: string | null
          id: string
          name: string
          scientific_name: string | null
          watering_interval_days: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          scientific_name?: string | null
          watering_interval_days: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          scientific_name?: string | null
          watering_interval_days?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          consent_to_reminders: boolean | null
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          consent_to_reminders?: boolean | null
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          consent_to_reminders?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      static_pages: {
        Row: {
          content: string
          id: string
          meta_description: string | null
          meta_title: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_plants: {
        Row: {
          created_at: string | null
          custom_name: string | null
          id: string
          last_watered: string | null
          last_watered_timestamp: string | null
          next_water_date: string
          photo_url: string | null
          plant_name: string
          scientific_name: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          watering_interval_days: number
        }
        Insert: {
          created_at?: string | null
          custom_name?: string | null
          id?: string
          last_watered?: string | null
          last_watered_timestamp?: string | null
          next_water_date: string
          photo_url?: string | null
          plant_name: string
          scientific_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          watering_interval_days: number
        }
        Update: {
          created_at?: string | null
          custom_name?: string | null
          id?: string
          last_watered?: string | null
          last_watered_timestamp?: string | null
          next_water_date?: string
          photo_url?: string | null
          plant_name?: string
          scientific_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          watering_interval_days?: number
        }
        Relationships: []
      }
      watering_logs: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          plant_id: string | null
          watered_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          plant_id?: string | null
          watered_date?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          plant_id?: string | null
          watered_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "watering_logs_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "user_plants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "admin"],
    },
  },
} as const
