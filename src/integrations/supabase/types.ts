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
      business_info: {
        Row: {
          aadhaar_no: string | null
          bank_branch: string | null
          bank_name: string | null
          block: string | null
          building_landmark: string | null
          building_no: string | null
          contact_number: string
          created_at: string
          date_of_birth: string | null
          district: string
          experience: number | null
          father_name: string | null
          gender: string | null
          gst_no: string | null
          house_name: string | null
          id: string
          line_of_activity: string | null
          loan_scheme: string | null
          loan_years: number | null
          monthly_rent: number | null
          municipality: string | null
          pan_no: string | null
          pin_code: string
          post_office: string | null
          project_id: string
          proposed_business: string
          proprietor_name: string
          qualification: string | null
          shop_name: string
          taluk: string | null
          unit_status: string | null
          village: string | null
        }
        Insert: {
          aadhaar_no?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          block?: string | null
          building_landmark?: string | null
          building_no?: string | null
          contact_number: string
          created_at?: string
          date_of_birth?: string | null
          district: string
          experience?: number | null
          father_name?: string | null
          gender?: string | null
          gst_no?: string | null
          house_name?: string | null
          id?: string
          line_of_activity?: string | null
          loan_scheme?: string | null
          loan_years?: number | null
          monthly_rent?: number | null
          municipality?: string | null
          pan_no?: string | null
          pin_code: string
          post_office?: string | null
          project_id: string
          proposed_business: string
          proprietor_name: string
          qualification?: string | null
          shop_name: string
          taluk?: string | null
          unit_status?: string | null
          village?: string | null
        }
        Update: {
          aadhaar_no?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          block?: string | null
          building_landmark?: string | null
          building_no?: string | null
          contact_number?: string
          created_at?: string
          date_of_birth?: string | null
          district?: string
          experience?: number | null
          father_name?: string | null
          gender?: string | null
          gst_no?: string | null
          house_name?: string | null
          id?: string
          line_of_activity?: string | null
          loan_scheme?: string | null
          loan_years?: number | null
          monthly_rent?: number | null
          municipality?: string | null
          pan_no?: string | null
          pin_code?: string
          post_office?: string | null
          project_id?: string
          proposed_business?: string
          proprietor_name?: string
          qualification?: string | null
          shop_name?: string
          taluk?: string | null
          unit_status?: string | null
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_info_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "loan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      depreciation_schedules: {
        Row: {
          created_at: string
          id: string
          project_id: string
          schedule_data: Json
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          schedule_data: Json
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          schedule_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "depreciation_schedules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "loan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_data: {
        Row: {
          created_at: string
          equity: number
          fixed_assets: Json
          fixed_opex: Json
          growth_rate: number
          id: string
          loan_amount: number
          materials: Json
          project_id: string
          sales_mix: Json
        }
        Insert: {
          created_at?: string
          equity?: number
          fixed_assets?: Json
          fixed_opex?: Json
          growth_rate?: number
          id?: string
          loan_amount: number
          materials?: Json
          project_id: string
          sales_mix?: Json
        }
        Update: {
          created_at?: string
          equity?: number
          fixed_assets?: Json
          fixed_opex?: Json
          growth_rate?: number
          id?: string
          loan_amount?: number
          materials?: Json
          project_id?: string
          sales_mix?: Json
        }
        Relationships: [
          {
            foreignKeyName: "finance_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "loan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_amortizations: {
        Row: {
          amortization_data: Json
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          amortization_data: Json
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          amortization_data?: Json
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_amortizations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "loan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_projects: {
        Row: {
          created_at: string
          id: string
          project_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      profit_loss_statements: {
        Row: {
          created_at: string
          id: string
          project_id: string
          statement_data: Json
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          statement_data: Json
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          statement_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "profit_loss_statements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "loan_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_permission: {
        Args: {
          _permission: Database["public"]["Enums"]["permission_type"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "manager"
      permission_type:
        | "view_firm_details"
        | "view_general_settings"
        | "view_calculations_settings"
        | "view_users_tab"
        | "view_data_tab"
        | "delete_projects"
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
      app_role: ["user", "manager"],
      permission_type: [
        "view_firm_details",
        "view_general_settings",
        "view_calculations_settings",
        "view_users_tab",
        "view_data_tab",
        "delete_projects",
      ],
    },
  },
} as const
