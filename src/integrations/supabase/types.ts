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
      api_request_logs: {
        Row: {
          bank_api_endpoint: string | null
          bank_request_id: string | null
          created_at: string
          endpoint_url: string
          error_code: string | null
          error_message: string | null
          http_method: Database["public"]["Enums"]["api_request_method"]
          id: string
          ip_address: unknown | null
          merchant_id: string | null
          request_body: Json | null
          request_headers: Json | null
          request_id: string
          response_body: Json | null
          response_headers: Json | null
          response_status: number | null
          response_time_ms: number | null
          user_agent: string | null
        }
        Insert: {
          bank_api_endpoint?: string | null
          bank_request_id?: string | null
          created_at?: string
          endpoint_url: string
          error_code?: string | null
          error_message?: string | null
          http_method: Database["public"]["Enums"]["api_request_method"]
          id?: string
          ip_address?: unknown | null
          merchant_id?: string | null
          request_body?: Json | null
          request_headers?: Json | null
          request_id: string
          response_body?: Json | null
          response_headers?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
        }
        Update: {
          bank_api_endpoint?: string | null
          bank_request_id?: string | null
          created_at?: string
          endpoint_url?: string
          error_code?: string | null
          error_message?: string | null
          http_method?: Database["public"]["Enums"]["api_request_method"]
          id?: string
          ip_address?: unknown | null
          merchant_id?: string | null
          request_body?: Json | null
          request_headers?: Json | null
          request_id?: string
          response_body?: Json | null
          response_headers?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      bank_transactions: {
        Row: {
          amount: number
          bank_charges: number | null
          bank_reference_number: string | null
          bank_response: Json | null
          beneficiary_account: string | null
          beneficiary_ifsc: string | null
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          gst_amount: number | null
          id: string
          merchant_id: string
          net_amount: number | null
          remarks: string | null
          remitter_account: string | null
          remitter_ifsc: string | null
          settlement_date: string | null
          status: Database["public"]["Enums"]["bank_transaction_status"]
          transaction_date: string
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["bank_transaction_type"]
          updated_at: string
          utr_number: string | null
          webhook_received_at: string | null
        }
        Insert: {
          amount: number
          bank_charges?: number | null
          bank_reference_number?: string | null
          bank_response?: Json | null
          beneficiary_account?: string | null
          beneficiary_ifsc?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          gst_amount?: number | null
          id?: string
          merchant_id: string
          net_amount?: number | null
          remarks?: string | null
          remitter_account?: string | null
          remitter_ifsc?: string | null
          settlement_date?: string | null
          status?: Database["public"]["Enums"]["bank_transaction_status"]
          transaction_date?: string
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["bank_transaction_type"]
          updated_at?: string
          utr_number?: string | null
          webhook_received_at?: string | null
        }
        Update: {
          amount?: number
          bank_charges?: number | null
          bank_reference_number?: string | null
          bank_response?: Json | null
          beneficiary_account?: string | null
          beneficiary_ifsc?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          gst_amount?: number | null
          id?: string
          merchant_id?: string
          net_amount?: number | null
          remarks?: string | null
          remitter_account?: string | null
          remitter_ifsc?: string | null
          settlement_date?: string | null
          status?: Database["public"]["Enums"]["bank_transaction_status"]
          transaction_date?: string
          transaction_id?: string
          transaction_type?: Database["public"]["Enums"]["bank_transaction_type"]
          updated_at?: string
          utr_number?: string | null
          webhook_received_at?: string | null
        }
        Relationships: []
      }
      bulk_upload_files: {
        Row: {
          bank_batch_id: string | null
          created_at: string
          error_log: Json | null
          failed_records: number | null
          file_checksum: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          merchant_id: string | null
          processed_records: number | null
          processing_completed_at: string | null
          processing_started_at: string | null
          processing_status: string
          settlement_file_generated: boolean | null
          settlement_file_path: string | null
          successful_records: number | null
          total_records: number | null
          updated_at: string
          upload_method: string
          validation_errors: Json | null
        }
        Insert: {
          bank_batch_id?: string | null
          created_at?: string
          error_log?: Json | null
          failed_records?: number | null
          file_checksum: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          merchant_id?: string | null
          processed_records?: number | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          processing_status?: string
          settlement_file_generated?: boolean | null
          settlement_file_path?: string | null
          successful_records?: number | null
          total_records?: number | null
          updated_at?: string
          upload_method?: string
          validation_errors?: Json | null
        }
        Update: {
          bank_batch_id?: string | null
          created_at?: string
          error_log?: Json | null
          failed_records?: number | null
          file_checksum?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          merchant_id?: string | null
          processed_records?: number | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          processing_status?: string
          settlement_file_generated?: boolean | null
          settlement_file_path?: string | null
          successful_records?: number | null
          total_records?: number | null
          updated_at?: string
          upload_method?: string
          validation_errors?: Json | null
        }
        Relationships: []
      }
      fund_transfer_jobs: {
        Row: {
          bank_reference: string | null
          beneficiary_account: string
          beneficiary_ifsc: string
          beneficiary_name: string
          charges_applied: number | null
          completed_at: string | null
          created_at: string
          failed_at: string | null
          failure_reason: string | null
          final_amount: number | null
          id: string
          job_id: string
          max_retries: number | null
          merchant_id: string
          payout_amount: number
          priority: number | null
          retry_count: number | null
          scheduled_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["fund_transfer_status"]
          transaction_id: string | null
          transfer_mode: Database["public"]["Enums"]["bank_transaction_type"]
          updated_at: string
          webhook_data: Json | null
        }
        Insert: {
          bank_reference?: string | null
          beneficiary_account: string
          beneficiary_ifsc: string
          beneficiary_name: string
          charges_applied?: number | null
          completed_at?: string | null
          created_at?: string
          failed_at?: string | null
          failure_reason?: string | null
          final_amount?: number | null
          id?: string
          job_id: string
          max_retries?: number | null
          merchant_id: string
          payout_amount: number
          priority?: number | null
          retry_count?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["fund_transfer_status"]
          transaction_id?: string | null
          transfer_mode: Database["public"]["Enums"]["bank_transaction_type"]
          updated_at?: string
          webhook_data?: Json | null
        }
        Update: {
          bank_reference?: string | null
          beneficiary_account?: string
          beneficiary_ifsc?: string
          beneficiary_name?: string
          charges_applied?: number | null
          completed_at?: string | null
          created_at?: string
          failed_at?: string | null
          failure_reason?: string | null
          final_amount?: number | null
          id?: string
          job_id?: string
          max_retries?: number | null
          merchant_id?: string
          payout_amount?: number
          priority?: number | null
          retry_count?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["fund_transfer_status"]
          transaction_id?: string | null
          transfer_mode?: Database["public"]["Enums"]["bank_transaction_type"]
          updated_at?: string
          webhook_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_transfer_jobs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "bank_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      merchant_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string | null
          bank_name: string
          branch_name: string | null
          created_at: string
          daily_limit: number | null
          id: string
          ifsc_code: string
          is_primary: boolean | null
          is_verified: boolean | null
          merchant_id: string
          monthly_limit: number | null
          status: string
          updated_at: string
          verification_date: string | null
          verification_details: Json | null
          verification_method: string | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type?: string | null
          bank_name: string
          branch_name?: string | null
          created_at?: string
          daily_limit?: number | null
          id?: string
          ifsc_code: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          merchant_id: string
          monthly_limit?: number | null
          status?: string
          updated_at?: string
          verification_date?: string | null
          verification_details?: Json | null
          verification_method?: string | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string | null
          bank_name?: string
          branch_name?: string | null
          created_at?: string
          daily_limit?: number | null
          id?: string
          ifsc_code?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          merchant_id?: string
          monthly_limit?: number | null
          status?: string
          updated_at?: string
          verification_date?: string | null
          verification_details?: Json | null
          verification_method?: string | null
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
      merchant_payout_settings: {
        Row: {
          auto_payout_enabled: boolean | null
          auto_payout_schedule: string | null
          auto_payout_threshold: number | null
          created_at: string
          daily_limit: number | null
          id: string
          merchant_id: string
          monthly_limit: number | null
          preferred_payout_method: string | null
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          auto_payout_enabled?: boolean | null
          auto_payout_schedule?: string | null
          auto_payout_threshold?: number | null
          created_at?: string
          daily_limit?: number | null
          id?: string
          merchant_id: string
          monthly_limit?: number | null
          preferred_payout_method?: string | null
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          auto_payout_enabled?: boolean | null
          auto_payout_schedule?: string | null
          auto_payout_threshold?: number | null
          created_at?: string
          daily_limit?: number | null
          id?: string
          merchant_id?: string
          monthly_limit?: number | null
          preferred_payout_method?: string | null
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
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
      payout_ledger: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string | null
          id: string
          merchant_id: string
          payout_request_id: string
          reference_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description?: string | null
          id?: string
          merchant_id: string
          payout_request_id: string
          reference_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string | null
          id?: string
          merchant_id?: string
          payout_request_id?: string
          reference_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_ledger_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "payout_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          account_number: string | null
          amount: number
          bank_name: string | null
          bank_reference_id: string | null
          beneficiary_name: string | null
          completed_at: string | null
          created_at: string
          currency: string
          description: string | null
          failed_at: string | null
          failure_reason: string | null
          gst_amount: number | null
          id: string
          ifsc_code: string | null
          internal_notes: string | null
          max_retries: number | null
          merchant_id: string
          net_amount: number | null
          next_retry_at: string | null
          payout_method: string
          priority: number | null
          processing_fee: number | null
          processing_started_at: string | null
          retry_count: number | null
          status: string
          updated_at: string
          upi_id: string | null
          utr_number: string | null
          webhook_data: Json | null
        }
        Insert: {
          account_number?: string | null
          amount: number
          bank_name?: string | null
          bank_reference_id?: string | null
          beneficiary_name?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          gst_amount?: number | null
          id?: string
          ifsc_code?: string | null
          internal_notes?: string | null
          max_retries?: number | null
          merchant_id: string
          net_amount?: number | null
          next_retry_at?: string | null
          payout_method: string
          priority?: number | null
          processing_fee?: number | null
          processing_started_at?: string | null
          retry_count?: number | null
          status?: string
          updated_at?: string
          upi_id?: string | null
          utr_number?: string | null
          webhook_data?: Json | null
        }
        Update: {
          account_number?: string | null
          amount?: number
          bank_name?: string | null
          bank_reference_id?: string | null
          beneficiary_name?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          gst_amount?: number | null
          id?: string
          ifsc_code?: string | null
          internal_notes?: string | null
          max_retries?: number | null
          merchant_id?: string
          net_amount?: number | null
          next_retry_at?: string | null
          payout_method?: string
          priority?: number | null
          processing_fee?: number | null
          processing_started_at?: string | null
          retry_count?: number | null
          status?: string
          updated_at?: string
          upi_id?: string | null
          utr_number?: string | null
          webhook_data?: Json | null
        }
        Relationships: []
      }
      payout_webhooks: {
        Row: {
          delivered: boolean | null
          id: string
          payload: Json
          payout_request_id: string
          response_body: string | null
          response_code: number | null
          sent_at: string
          webhook_type: string
        }
        Insert: {
          delivered?: boolean | null
          id?: string
          payload: Json
          payout_request_id: string
          response_body?: string | null
          response_code?: number | null
          sent_at?: string
          webhook_type: string
        }
        Update: {
          delivered?: boolean | null
          id?: string
          payload?: Json
          payout_request_id?: string
          response_body?: string | null
          response_code?: number | null
          sent_at?: string
          webhook_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_webhooks_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "payout_requests"
            referencedColumns: ["id"]
          },
        ]
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
      utr_logs: {
        Row: {
          bank_transaction_id: string | null
          created_at: string
          duplicate_check: boolean | null
          error_message: string | null
          id: string
          processed_at: string | null
          processing_status: string
          received_at: string
          utr_number: string
          webhook_payload: Json
          webhook_signature: string | null
          webhook_source: string
        }
        Insert: {
          bank_transaction_id?: string | null
          created_at?: string
          duplicate_check?: boolean | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          processing_status?: string
          received_at?: string
          utr_number: string
          webhook_payload: Json
          webhook_signature?: string | null
          webhook_source: string
        }
        Update: {
          bank_transaction_id?: string | null
          created_at?: string
          duplicate_check?: boolean | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          processing_status?: string
          received_at?: string
          utr_number?: string
          webhook_payload?: Json
          webhook_signature?: string | null
          webhook_source?: string
        }
        Relationships: [
          {
            foreignKeyName: "utr_logs_bank_transaction_id_fkey"
            columns: ["bank_transaction_id"]
            isOneToOne: false
            referencedRelation: "bank_transactions"
            referencedColumns: ["id"]
          },
        ]
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
      calculate_payout_net_amount: {
        Args: {
          gross_amount: number
          processing_fee?: number
          gst_rate?: number
        }
        Returns: number
      }
      get_merchant_wallet_balance: {
        Args: { merchant_uuid: string }
        Returns: number
      }
      get_or_create_api_key: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      api_request_method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
      app_role: "admin" | "moderator" | "user"
      bank_transaction_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      bank_transaction_type: "NEFT" | "RTGS" | "IMPS" | "UPI"
      fund_transfer_status:
        | "queued"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
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
      api_request_method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      app_role: ["admin", "moderator", "user"],
      bank_transaction_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      bank_transaction_type: ["NEFT", "RTGS", "IMPS", "UPI"],
      fund_transfer_status: [
        "queued",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      merchant_verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const
