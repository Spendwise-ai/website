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
      boards: {
        Row: {
          created_at: string
          expanded: boolean
          id: number
          name: string | null
          order_index: number
          owner_id: string
        }
        Insert: {
          created_at?: string
          expanded?: boolean
          id?: number
          name?: string | null
          order_index?: number
          owner_id?: string
        }
        Update: {
          created_at?: string
          expanded?: boolean
          id?: number
          name?: string | null
          order_index?: number
          owner_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          board_id: number | null
          completed: boolean
          created_at: string
          id: number
          name: string | null
          order: number
          owner_id: string | null
        }
        Insert: {
          board_id?: number | null
          completed?: boolean
          created_at?: string
          id?: number
          name?: string | null
          order?: number
          owner_id?: string | null
        }
        Update: {
          board_id?: number | null
          completed?: boolean
          created_at?: string
          id?: number
          name?: string | null
          order?: number
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      category: {
        Row: {
          color: string | null
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          color?: string | null
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          color?: string | null
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      entity: {
        Row: {
          color: string
          created_at: string
          icon: string | null
          id: number
          name: string
          provider: Database["public"]["Enums"]["Banking Provider"] | null
          user_id: string | null
        }
        Insert: {
          color?: string
          created_at?: string
          icon?: string | null
          id?: number
          name: string
          provider?: Database["public"]["Enums"]["Banking Provider"] | null
          user_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string | null
          id?: number
          name?: string
          provider?: Database["public"]["Enums"]["Banking Provider"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      habits: {
        Row: {
          complete_days: string[]
          created_at: string
          description: string
          id: number
          private: boolean
          target_days: number
          title: string
          user_id: string
        }
        Insert: {
          complete_days?: string[]
          created_at?: string
          description?: string
          id?: number
          private?: boolean
          target_days?: number
          title?: string
          user_id: string
        }
        Update: {
          complete_days?: string[]
          created_at?: string
          description?: string
          id?: number
          private?: boolean
          target_days?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          description: string
          email: string
          first_name: string
          id: string
          image_url: string | null
          last_name: string
          username: string
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          description?: string
          email: string
          first_name?: string
          id?: string
          image_url?: string | null
          last_name?: string
          username?: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          description?: string
          email?: string
          first_name?: string
          id?: string
          image_url?: string | null
          last_name?: string
          username?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: number
          created_at: string
          currency: Database["public"]["Enums"]["Currency"]
          date: string
          id: number
          name: string | null
          recipient_id: number
          sender_id: number
          type: Database["public"]["Enums"]["TRANSACTION_TYPE"]
        }
        Insert: {
          amount?: number
          category_id?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["Currency"]
          date?: string
          id?: number
          name?: string | null
          recipient_id: number
          sender_id: number
          type?: Database["public"]["Enums"]["TRANSACTION_TYPE"]
        }
        Update: {
          amount?: number
          category_id?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["Currency"]
          date?: string
          id?: number
          name?: string | null
          recipient_id?: number
          sender_id?: number
          type?: Database["public"]["Enums"]["TRANSACTION_TYPE"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "entity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "entity"
            referencedColumns: ["id"]
          },
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
      "Banking Provider": "maybank" | "touchngo"
      Currency: "RM" | "USD"
      TRANSACTION_TYPE: "expense" | "transfer" | "profit" | "salary" | "load"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
