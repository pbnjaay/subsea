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
          system: Database["public"]["Enums"]["system"]
          title: string | null
          type: Database["public"]["Enums"]["activity_type"] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          shift?: number | null
          system: Database["public"]["Enums"]["system"]
          title?: string | null
          type?: Database["public"]["Enums"]["activity_type"] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          shift?: number | null
          system?: Database["public"]["Enums"]["system"]
          title?: string | null
          type?: Database["public"]["Enums"]["activity_type"] | null
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
      profile: {
        Row: {
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      warningpoint: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: number
          shift: number | null
          state: Database["public"]["Enums"]["state"] | null
          system: Database["public"]["Enums"]["system"] | null
          title: string | null
          type: Database["public"]["Enums"]["signal_incident"] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          shift?: number | null
          state?: Database["public"]["Enums"]["state"] | null
          system?: Database["public"]["Enums"]["system"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["signal_incident"] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          shift?: number | null
          state?: Database["public"]["Enums"]["state"] | null
          system?: Database["public"]["Enums"]["system"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["signal_incident"] | null
        }
        Relationships: [
          {
            foreignKeyName: "warningpoint_shift_fkey"
            columns: ["shift"]
            isOneToOne: false
            referencedRelation: "shift"
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
      activity_type: "claim" | "callID" | "instance" | "other"
      signal_incident: "signalisation" | "incident"
      state: "open" | "in progress" | "closed"
      system: "sat3" | "mainone" | "rafia" | "ace"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
