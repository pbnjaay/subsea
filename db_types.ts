export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activity: {
        Row: {
          created_at: string
          description: string | null
          id: number
          shift: number | null
          state: Database["public"]["Enums"]["state"]
          system: Database["public"]["Enums"]["system"]
          title: string
          type: Database["public"]["Enums"]["type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          shift?: number | null
          state?: Database["public"]["Enums"]["state"]
          system: Database["public"]["Enums"]["system"]
          title?: string
          type: Database["public"]["Enums"]["type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          shift?: number | null
          state?: Database["public"]["Enums"]["state"]
          system?: Database["public"]["Enums"]["system"]
          title?: string
          type?: Database["public"]["Enums"]["type"]
        }
        Relationships: [
          {
            foreignKeyName: "activity_shift_fkey"
            columns: ["shift"]
            isOneToOne: false
            referencedRelation: "shift"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shift: {
        Row: {
          created_at: string
          end_at: string | null
          id: number
          is_alarm_checked: boolean | null
          is_basic_done: boolean | null
          is_room_checked: boolean | null
          start_at: string | null
          supervisor: string | null
        }
        Insert: {
          created_at?: string
          end_at?: string | null
          id?: number
          is_alarm_checked?: boolean | null
          is_basic_done?: boolean | null
          is_room_checked?: boolean | null
          start_at?: string | null
          supervisor?: string | null
        }
        Update: {
          created_at?: string
          end_at?: string | null
          id?: number
          is_alarm_checked?: boolean | null
          is_basic_done?: boolean | null
          is_room_checked?: boolean | null
          start_at?: string | null
          supervisor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_supervisor_fkey"
            columns: ["supervisor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
      state: "open" | "in progress" | "closed"
      system: "sat3" | "mainone" | "rafia" | "ace"
      type: "plainte" | "call Id" | "signalisation" | "incident" | "autre"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
