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
      ip_whitelist: {
        Row: {
          created_at: string
          created_by: string
          id: string
          ip_address: unknown
          merchant_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          ip_address: unknown
          merchant_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          ip_address?: unknown
          merchant_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ip_whitelist_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_submissions: {
        Row: {
          aadhaar_document_path: string | null
          gst_document_path: string | null
          gst_number: string | null
          id: string
          notes: string | null
          pan_document_path: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aadhaar_document_path?: string | null
          gst_document_path?: string | null
          gst_number?: string | null
          id?: string
          notes?: string | null
          pan_document_path?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aadhaar_document_path?: string | null
          gst_document_path?: string | null
          gst_number?: string | null
          id?: string
          notes?: string | null
          pan_document_path?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      merchant_documents: {
        Row: {
          document_type: string
          document_url: string
          id: string
          merchant_id: string | null
          status:
            | Database["public"]["Enums"]["merchant_verification_status"]
            | null
          uploaded_at: string | null
          verification_notes: string | null
          verified_at: string | null
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          merchant_id?: string | null
          status?:
            | Database["public"]["Enums"]["merchant_verification_status"]
            | null
          uploaded_at?: string | null
          verification_notes?: string | null
          verified_at?: string | null
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          merchant_id?: string | null
          status?:
            | Database["public"]["Enums"]["merchant_verification_status"]
            | null
          uploaded_at?: string | null
          verification_notes?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      merchant_profiles: {
        Row: {
          api_key: string | null
          business_address: string
          business_name: string
          business_type: string
          contact_email: string
          contact_phone: string
          created_at: string | null
          gst_number: string | null
          id: string
          is_active: boolean | null
          pan_number: string
          verification_status:
            | Database["public"]["Enums"]["merchant_verification_status"]
            | null
        }
        Insert: {
          api_key?: string | null
          business_address: string
          business_name: string
          business_type: string
          contact_email: string
          contact_phone: string
          created_at?: string | null
          gst_number?: string | null
          id: string
          is_active?: boolean | null
          pan_number: string
          verification_status?:
            | Database["public"]["Enums"]["merchant_verification_status"]
            | null
        }
        Update: {
          api_key?: string | null
          business_address?: string
          business_name?: string
          business_type?: string
          contact_email?: string
          contact_phone?: string
          created_at?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          pan_number?: string
          verification_status?:
            | Database["public"]["Enums"]["merchant_verification_status"]
            | null
        }
        Relationships: []
      }
      merchants: {
        Row: {
          api_key: string | null
          business_name: string
          business_type: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          status: string | null
        }
        Insert: {
          api_key?: string | null
          business_name: string
          business_type?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          api_key?: string | null
          business_name?: string
          business_type?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          currency: string
          customer_email: string | null
          customer_name: string | null
          date: string
          description: string | null
          id: string
          merchant_id: string | null
          payment_details: Json | null
          payment_method: string
          processing_state: string | null
          processing_timeline: Json | null
          status: string
        }
        Insert: {
          amount: number
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          date?: string
          description?: string | null
          id: string
          merchant_id?: string | null
          payment_details?: Json | null
          payment_method: string
          processing_state?: string | null
          processing_timeline?: Json | null
          status: string
        }
        Update: {
          amount?: number
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          date?: string
          description?: string | null
          id?: string
          merchant_id?: string | null
          payment_details?: Json | null
          payment_method?: string
          processing_state?: string | null
          processing_timeline?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
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
        Relationships: []
      }
      webhook_whitelist: {
        Row: {
          created_at: string
          created_by: string
          domain: string
          id: string
          merchant_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          domain: string
          id?: string
          merchant_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          domain?: string
          id?: string
          merchant_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_whitelist_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_or_create_api_key: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      merchant_verification_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      merchant_verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const
