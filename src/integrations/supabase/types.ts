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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agreement_acceptances: {
        Row: {
          accepted_at: string
          agreement_version: string
          contact_email: string
          contracting_type: string
          created_at: string
          entity_address: Json | null
          entity_confirmed: boolean | null
          entity_name: string | null
          entity_registration_number: string | null
          full_legal_name: string
          id: string
          mobile_country_code: string
          mobile_number: string
          profile_id: string
          residential_address: Json
          signature_name: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          accepted_at?: string
          agreement_version: string
          contact_email: string
          contracting_type: string
          created_at?: string
          entity_address?: Json | null
          entity_confirmed?: boolean | null
          entity_name?: string | null
          entity_registration_number?: string | null
          full_legal_name: string
          id?: string
          mobile_country_code: string
          mobile_number: string
          profile_id: string
          residential_address: Json
          signature_name: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          accepted_at?: string
          agreement_version?: string
          contact_email?: string
          contracting_type?: string
          created_at?: string
          entity_address?: Json | null
          entity_confirmed?: boolean | null
          entity_name?: string | null
          entity_registration_number?: string | null
          full_legal_name?: string
          id?: string
          mobile_country_code?: string
          mobile_number?: string
          profile_id?: string
          residential_address?: Json
          signature_name?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agreement_acceptances_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          alpha2_code: string
          alpha3_code: string
          country_code: number
          created_at: string | null
          id: string
          intermediate_region: string | null
          intermediate_region_code: number | null
          iso_3166_2: string | null
          name: string
          region: string | null
          region_code: number | null
          sub_region: string | null
          sub_region_code: number | null
          updated_at: string | null
        }
        Insert: {
          alpha2_code: string
          alpha3_code: string
          country_code: number
          created_at?: string | null
          id?: string
          intermediate_region?: string | null
          intermediate_region_code?: number | null
          iso_3166_2?: string | null
          name: string
          region?: string | null
          region_code?: number | null
          sub_region?: string | null
          sub_region_code?: number | null
          updated_at?: string | null
        }
        Update: {
          alpha2_code?: string
          alpha3_code?: string
          country_code?: number
          created_at?: string | null
          id?: string
          intermediate_region?: string | null
          intermediate_region_code?: number | null
          iso_3166_2?: string | null
          name?: string
          region?: string | null
          region_code?: number | null
          sub_region?: string | null
          sub_region_code?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fractional_industry_preferences: {
        Row: {
          created_at: string
          id: string
          industry_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          industry_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fractional_industry_preferences_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fractional_industry_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fractional_location_preferences: {
        Row: {
          created_at: string
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fractional_location_preferences_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fractional_location_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fractional_preferences: {
        Row: {
          created_at: string
          id: string
          max_daily_rate: number | null
          max_hourly_rate: number | null
          max_hours_per_week: number | null
          min_daily_rate: number | null
          min_hourly_rate: number | null
          min_hours_per_week: number | null
          open_for_work: boolean
          payment_type: string | null
          remote_ok: boolean | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_daily_rate?: number | null
          max_hourly_rate?: number | null
          max_hours_per_week?: number | null
          min_daily_rate?: number | null
          min_hourly_rate?: number | null
          min_hours_per_week?: number | null
          open_for_work?: boolean
          payment_type?: string | null
          remote_ok?: boolean | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_daily_rate?: number | null
          max_hourly_rate?: number | null
          max_hours_per_week?: number | null
          min_daily_rate?: number | null
          min_hourly_rate?: number | null
          min_hours_per_week?: number | null
          open_for_work?: boolean
          payment_type?: string | null
          remote_ok?: boolean | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fractional_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      full_time_industry_preferences: {
        Row: {
          created_at: string
          id: string
          industry_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          industry_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "full_time_industry_preferences_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "full_time_industry_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      full_time_location_preferences: {
        Row: {
          created_at: string
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "full_time_location_preferences_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "full_time_location_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      full_time_preferences: {
        Row: {
          created_at: string
          id: string
          max_salary: number | null
          min_salary: number | null
          open_for_work: boolean
          remote_ok: boolean | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_salary?: number | null
          min_salary?: number | null
          open_for_work?: boolean
          remote_ok?: boolean | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_salary?: number | null
          min_salary?: number | null
          open_for_work?: boolean
          remote_ok?: boolean | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "full_time_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_descriptions: {
        Row: {
          client_name: string | null
          created_at: string
          google_doc_url: string | null
          id: string
          jd_data: Json
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          google_doc_url?: string | null
          id?: string
          jd_data?: Json
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          created_at?: string
          google_doc_url?: string | null
          id?: string
          jd_data?: Json
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      linkedin_profiles: {
        Row: {
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          current_company: string | null
          education: Json | null
          experience: Json | null
          first_name: string | null
          follower_count: number | null
          full_name: string | null
          headline: string | null
          id: string
          last_name: string | null
          linkedin_url: string
          location_text: string | null
          raw_data: Json | null
          scraped_at: string | null
          search_query: string | null
          skills: Json | null
          state: string | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          current_company?: string | null
          education?: Json | null
          experience?: Json | null
          first_name?: string | null
          follower_count?: number | null
          full_name?: string | null
          headline?: string | null
          id?: string
          last_name?: string | null
          linkedin_url: string
          location_text?: string | null
          raw_data?: Json | null
          scraped_at?: string | null
          search_query?: string | null
          skills?: Json | null
          state?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          current_company?: string | null
          education?: Json | null
          experience?: Json | null
          first_name?: string | null
          follower_count?: number | null
          full_name?: string | null
          headline?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string
          location_text?: string | null
          raw_data?: Json | null
          scraped_at?: string | null
          search_query?: string | null
          skills?: Json | null
          state?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          city: string | null
          country_code: string | null
          created_at: string
          formatted_address: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          place_id: string
          place_types: string[] | null
          state_province: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          created_at?: string
          formatted_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          place_id: string
          place_types?: string[] | null
          state_province?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country_code?: string | null
          created_at?: string
          formatted_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          place_id?: string
          place_types?: string[] | null
          state_province?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["alpha2_code"]
          },
        ]
      }
      profile_documents: {
        Row: {
          created_at: string
          file_size: number | null
          id: string
          mime_type: string | null
          original_filename: string
          storage_path: string
          title: string | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_filename: string
          storage_path: string
          title?: string | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string
          storage_path?: string
          title?: string | null
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_embeddings: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: string
          last_embedded_at: string | null
          metadata: Json | null
          profile_id: string | null
          text_hash: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          last_embedded_at?: string | null
          metadata?: Json | null
          profile_id?: string | null
          text_hash?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          last_embedded_at?: string | null
          metadata?: Json | null
          profile_id?: string | null
          text_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          anon_profile_data: Json | null
          anon_slug: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          ispublished: boolean | null
          last_name: string | null
          linkedinurl: string | null
          notification_preferences: Json | null
          onboarding_status: Database["public"]["Enums"]["onboarding_status"]
          profile_data: Json
          profile_data_original: Json | null
          profile_slug: string | null
          profile_type: Database["public"]["Enums"]["profile_type"]
          profile_version: string
          updated_at: string
        }
        Insert: {
          anon_profile_data?: Json | null
          anon_slug?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          ispublished?: boolean | null
          last_name?: string | null
          linkedinurl?: string | null
          notification_preferences?: Json | null
          onboarding_status?: Database["public"]["Enums"]["onboarding_status"]
          profile_data?: Json
          profile_data_original?: Json | null
          profile_slug?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type"]
          profile_version?: string
          updated_at?: string
        }
        Update: {
          anon_profile_data?: Json | null
          anon_slug?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          ispublished?: boolean | null
          last_name?: string | null
          linkedinurl?: string | null
          notification_preferences?: Json | null
          onboarding_status?: Database["public"]["Enums"]["onboarding_status"]
          profile_data?: Json
          profile_data_original?: Json | null
          profile_slug?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type"]
          profile_version?: string
          updated_at?: string
        }
        Relationships: []
      }
      timezones: {
        Row: {
          abbr: string
          created_at: string | null
          id: string
          isdst: boolean
          text: string
          updated_at: string | null
          utc: string[]
          utc_offset: number
          value: string
        }
        Insert: {
          abbr: string
          created_at?: string | null
          id?: string
          isdst: boolean
          text: string
          updated_at?: string | null
          utc: string[]
          utc_offset: number
          value: string
        }
        Update: {
          abbr?: string
          created_at?: string | null
          id?: string
          isdst?: boolean
          text?: string
          updated_at?: string | null
          utc?: string[]
          utc_offset?: number
          value?: string
        }
        Relationships: []
      }
      user_location_preferences: {
        Row: {
          created_at: string
          id: string
          location_id: string
          preference_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          preference_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          preference_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_location_preferences_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_location_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_work_eligibility: {
        Row: {
          country_code: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          country_code: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_work_eligibility_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["alpha2_code"]
          },
          {
            foreignKeyName: "user_work_eligibility_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_preferences: {
        Row: {
          created_at: string
          current_location_id: string | null
          id: string
          timezone_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_location_id?: string | null
          id?: string
          timezone_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_location_id?: string | null
          id?: string
          timezone_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_preferences_current_location_id_fkey"
            columns: ["current_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_preferences_timezone_id_fkey"
            columns: ["timezone_id"]
            isOneToOne: false
            referencedRelation: "timezones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
      check_linkedin_cache: {
        Args: { p_urls: string[] }
        Returns: {
          city: string
          country: string
          country_code: string
          current_company: string
          education: Json
          experience: Json
          first_name: string
          follower_count: number
          full_name: string
          headline: string
          last_name: string
          linkedin_url: string
          location_text: string
          raw_data: Json
          skills: Json
          state: string
          summary: string
        }[]
      }
      create_guest_profile: {
        Args: {
          p_anon_profile_data: Json
          p_linkedin_url?: string
          p_profile_data: Json
        }
        Returns: Json
      }
      create_job_description: {
        Args: {
          p_client_name?: string
          p_google_doc_url?: string
          p_jd_data: Json
          p_status?: string
        }
        Returns: Json
      }
      generate_unique_anon_slug: {
        Args: { p_anon_data: Json; p_user_id: string }
        Returns: string
      }
      generate_unique_jd_slug: {
        Args: { p_location: string; p_role_title: string }
        Returns: string
      }
      generate_unique_profile_slug: {
        Args: { p_first_name: string; p_last_name: string; p_user_id: string }
        Returns: string
      }
      get_anon_profile: {
        Args: { anon_slug_param: string }
        Returns: {
          anon_profile_data: Json
          anon_slug: string
          profile_version: string
        }[]
      }
      get_current_agreement_status: {
        Args: { p_current_version: string }
        Returns: {
          accepted_at: string
          agreement_version: string
          is_accepted: boolean
          is_current_version: boolean
        }[]
      }
      get_job_description: { Args: { p_slug: string }; Returns: Json }
      get_profiles_by_slugs: {
        Args: { p_slugs: string[] }
        Returns: {
          email: string
          first_name: string
          last_name: string
          linkedinurl: string
          profile_data: Json
          profile_slug: string
        }[]
      }
      get_public_profile: {
        Args: { profile_slug_param: string }
        Returns: {
          first_name: string
          last_name: string
          linkedinurl: string
          profile_data: Json
          profile_slug: string
          profile_version: string
        }[]
      }
      get_public_profile_by_id: {
        Args: { profile_id_param: string }
        Returns: {
          first_name: string
          last_name: string
          linkedinurl: string
          profile_data: Json
          profile_slug: string
          profile_version: string
        }[]
      }
      list_job_descriptions: {
        Args: { p_limit?: number; p_status?: string }
        Returns: Json
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      record_agreement_acceptance: {
        Args: {
          p_agreement_version: string
          p_contact_email: string
          p_contracting_type: string
          p_entity_address?: Json
          p_entity_confirmed?: boolean
          p_entity_name?: string
          p_entity_registration_number?: string
          p_full_legal_name: string
          p_mobile_country_code: string
          p_mobile_number: string
          p_residential_address: Json
          p_signature_name: string
          p_user_agent?: string
        }
        Returns: {
          accepted_at: string
          agreement_version: string
          contact_email: string
          contracting_type: string
          created_at: string
          entity_address: Json | null
          entity_confirmed: boolean | null
          entity_name: string | null
          entity_registration_number: string | null
          full_legal_name: string
          id: string
          mobile_country_code: string
          mobile_number: string
          profile_id: string
          residential_address: Json
          signature_name: string
          updated_at: string
          user_agent: string | null
        }
      }
      save_linkedin_profiles: {
        Args: { p_profiles: Json; p_search_query?: string }
        Returns: Json
      }
      update_job_description: {
        Args: {
          p_client_name?: string
          p_google_doc_url?: string
          p_jd_data: Json
          p_slug: string
          p_status?: string
        }
        Returns: Json
      }
    }
    Enums: {
      document_type: "resume" | "linkedin" | "other"
      onboarding_status:
        | "SIGNED_UP"
        | "EMAIL_CONFIRMED"
        | "PROFILE_GENERATED"
        | "PROFILE_CONFIRMED"
        | "PREFERENCES_SET"
        | "SET_PASSWORD"
      profile_type: "authenticated" | "guest"
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
      document_type: ["resume", "linkedin", "other"],
      onboarding_status: [
        "SIGNED_UP",
        "EMAIL_CONFIRMED",
        "PROFILE_GENERATED",
        "PROFILE_CONFIRMED",
        "PREFERENCES_SET",
        "SET_PASSWORD",
      ],
      profile_type: ["authenticated", "guest"],
    },
  },
} as const
