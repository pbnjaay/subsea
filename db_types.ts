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
          supervisor: string | null
        }
        Insert: {
          created_at?: string
          end_at?: string | null
          id?: number
          is_alarm_checked?: boolean | null
          is_basic_done?: boolean | null
          is_room_checked?: boolean | null
          supervisor?: string | null
        }
        Update: {
          created_at?: string
          end_at?: string | null
          id?: number
          is_alarm_checked?: boolean | null
          is_basic_done?: boolean | null
          is_room_checked?: boolean | null
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
