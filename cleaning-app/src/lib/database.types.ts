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
      availability_rules: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          end_time: string
          id: string
          start_time: string
          weekday: number
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          weekday: number
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          default_language: string
          default_travel_buffer_minutes: number
          email: string
          external_ref: string | null
          id: string
          name: string
          owner_user_id: string
          phone: string | null
          service_area: string | null
          subscription_status: string
          timezone: string
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_language?: string
          default_travel_buffer_minutes?: number
          email: string
          external_ref?: string | null
          id?: string
          name: string
          owner_user_id: string
          phone?: string | null
          service_area?: string | null
          subscription_status?: string
          timezone?: string
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_language?: string
          default_travel_buffer_minutes?: number
          email?: string
          external_ref?: string | null
          id?: string
          name?: string
          owner_user_id?: string
          phone?: string | null
          service_area?: string | null
          subscription_status?: string
          timezone?: string
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          archived_at: string | null
          business_id: string
          city: string | null
          created_at: string
          email: string
          external_ref: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          preferred_contact: string
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          archived_at?: string | null
          business_id: string
          city?: string | null
          created_at?: string
          email: string
          external_ref?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          preferred_contact?: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          archived_at?: string | null
          business_id?: string
          city?: string | null
          created_at?: string
          email?: string
          external_ref?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          preferred_contact?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          line_total?: number
          quantity?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          business_id: string
          client_id: string | null
          created_at: string
          due_at: string | null
          external_ref: string | null
          id: string
          job_id: string | null
          quote_id: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          business_id: string
          client_id?: string | null
          created_at?: string
          due_at?: string | null
          external_ref?: string | null
          id?: string
          job_id?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          client_id?: string | null
          created_at?: string
          due_at?: string | null
          external_ref?: string | null
          id?: string
          job_id?: string | null
          quote_id?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      job_assignments: {
        Row: {
          created_at: string
          id: string
          job_id: string
          team_member_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          team_member_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_assignments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_assignments_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      job_time_entries: {
        Row: {
          business_id: string
          clocked_in_at: string
          clocked_out_at: string | null
          created_at: string
          id: string
          job_id: string
          minutes_worked: number | null
          team_member_id: string | null
        }
        Insert: {
          business_id: string
          clocked_in_at: string
          clocked_out_at?: string | null
          created_at?: string
          id?: string
          job_id: string
          minutes_worked?: number | null
          team_member_id?: string | null
        }
        Update: {
          business_id?: string
          clocked_in_at?: string
          clocked_out_at?: string | null
          created_at?: string
          id?: string
          job_id?: string
          minutes_worked?: number | null
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_time_entries_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_time_entries_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_time_entries_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          business_id: string
          client_id: string | null
          created_at: string
          duration_minutes: number
          external_ref: string | null
          id: string
          notes: string | null
          quote_id: string | null
          recurrence_rule_id: string | null
          route_order: number | null
          service_address: string
          service_id: string | null
          starts_at: string
          status: string
          travel_buffer_after_minutes: number
          travel_buffer_before_minutes: number
          updated_at: string
        }
        Insert: {
          business_id: string
          client_id?: string | null
          created_at?: string
          duration_minutes: number
          external_ref?: string | null
          id?: string
          notes?: string | null
          quote_id?: string | null
          recurrence_rule_id?: string | null
          route_order?: number | null
          service_address: string
          service_id?: string | null
          starts_at: string
          status?: string
          travel_buffer_after_minutes?: number
          travel_buffer_before_minutes?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          client_id?: string | null
          created_at?: string
          duration_minutes?: number
          external_ref?: string | null
          id?: string
          notes?: string | null
          quote_id?: string | null
          recurrence_rule_id?: string | null
          route_order?: number | null
          service_address?: string
          service_id?: string | null
          starts_at?: string
          status?: string
          travel_buffer_after_minutes?: number
          travel_buffer_before_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_recurrence_rule_id_fkey"
            columns: ["recurrence_rule_id"]
            isOneToOne: false
            referencedRelation: "recurrence_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          archived_at: string | null
          business_id: string
          created_at: string
          email: string
          external_ref: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          preferred_contact: string
          service_interest: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          business_id: string
          created_at?: string
          email: string
          external_ref?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string
          service_interest?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          business_id?: string
          created_at?: string
          email?: string
          external_ref?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string
          service_interest?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      mileage_logs: {
        Row: {
          business_id: string
          created_at: string
          end_odometer: number | null
          id: string
          job_id: string | null
          log_date: string
          miles: number | null
          notes: string | null
          start_odometer: number | null
        }
        Insert: {
          business_id: string
          created_at?: string
          end_odometer?: number | null
          id?: string
          job_id?: string | null
          log_date?: string
          miles?: number | null
          notes?: string | null
          start_odometer?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string
          end_odometer?: number | null
          id?: string
          job_id?: string | null
          log_date?: string
          miles?: number | null
          notes?: string | null
          start_odometer?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mileage_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mileage_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          business_id: string
          created_at: string
          external_ref: string | null
          id: string
          invoice_id: string
          method: string
          paid_at: string | null
          status: string
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string
          external_ref?: string | null
          id?: string
          invoice_id: string
          method: string
          paid_at?: string | null
          status?: string
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string
          external_ref?: string | null
          id?: string
          invoice_id?: string
          method?: string
          paid_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          addon_id: string | null
          created_at: string
          description: string
          id: string
          line_total: number
          quantity: number
          quote_id: string
          service_id: string | null
          unit_price: number
        }
        Insert: {
          addon_id?: string | null
          created_at?: string
          description: string
          id?: string
          line_total?: number
          quantity?: number
          quote_id: string
          service_id?: string | null
          unit_price?: number
        }
        Update: {
          addon_id?: string | null
          created_at?: string
          description?: string
          id?: string
          line_total?: number
          quantity?: number
          quote_id?: string
          service_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "service_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          accepted_at: string | null
          business_id: string
          client_id: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          external_ref: string | null
          id: string
          lead_id: string | null
          notes: string | null
          preferred_date: string | null
          preferred_time: string | null
          service_address: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          business_id: string
          client_id?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          external_ref?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          service_address?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          business_id?: string
          client_id?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          external_ref?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          service_address?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      recurrence_rules: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          ends_on: string | null
          frequency: string
          id: string
          interval_count: number
          starts_on: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          ends_on?: string | null
          frequency: string
          id?: string
          interval_count?: number
          starts_on: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          ends_on?: string | null
          frequency?: string
          id?: string
          interval_count?: number
          starts_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurrence_rules_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      service_addons: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          extra_duration_minutes: number
          id: string
          name: string
          price: number
          service_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          extra_duration_minutes?: number
          id?: string
          name: string
          price?: number
          service_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          extra_duration_minutes?: number
          id?: string
          name?: string
          price?: number
          service_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_addons_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_addons_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          base_price: number | null
          business_id: string
          created_at: string
          default_duration_minutes: number
          description: string | null
          external_ref: string | null
          id: string
          name: string
          pricing_type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          base_price?: number | null
          business_id: string
          created_at?: string
          default_duration_minutes?: number
          description?: string | null
          external_ref?: string | null
          id?: string
          name: string
          pricing_type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          base_price?: number | null
          business_id?: string
          created_at?: string
          default_duration_minutes?: number
          description?: string | null
          external_ref?: string | null
          id?: string
          name?: string
          pricing_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          email: string | null
          external_ref: string | null
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          email?: string | null
          external_ref?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          email?: string | null
          external_ref?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_today_jobs: {
        Args: { p_business_id: string }
        Returns: {
          client_name: string
          duration_minutes: number
          id: string
          route_order: number
          service_address: string
          starts_at: string
          status: string
          travel_buffer_after_minutes: number
          travel_buffer_before_minutes: number
        }[]
      }
      get_today_mileage_total: {
        Args: { p_business_id: string }
        Returns: number
      }
      get_today_work_minutes: {
        Args: { p_business_id: string }
        Returns: number
      }
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
