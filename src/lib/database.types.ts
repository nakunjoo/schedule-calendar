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
      options: {
        Row: {
          id: string
          user_id: string
          calendar_view: string | null
          theme: string | null
          theme_color: string
          bg_color: string
          language: string
          holiday: boolean
          lunar: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          calendar_view?: string | null
          theme?: string | null
          theme_color?: string
          bg_color?: string
          language?: string
          holiday?: boolean
          lunar?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          calendar_view?: string | null
          theme?: string | null
          theme_color?: string
          bg_color?: string
          language?: string
          holiday?: boolean
          lunar?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          name: string
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      schedules: {
        Row: {
          id: string
          user_id: string
          date: string
          title: string
          start_time: string | null
          end_time: string | null
          category_id: string | null
          description: string | null
          type: string
          turn: number
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          date: string
          title: string
          start_time?: string | null
          end_time?: string | null
          category_id?: string | null
          description?: string | null
          type?: string
          turn?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          title?: string
          start_time?: string | null
          end_time?: string | null
          category_id?: string | null
          description?: string | null
          type?: string
          turn?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}