// Database types based on the PRD requirements
export type UserRole = 'user' | 'farmer' | 'admin' | 'support';

export type ListingStatus = 'available' | 'sold' | 'expired';

export type GroupBuyStatus = 'active' | 'funded' | 'completed' | 'cancelled';

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled';

export type TransactionType = 'payout' | 'commission';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          photo_url: string | null;
          bio: string | null;
          phone: string | null;
          role: UserRole;
          email_verified: boolean;
          theme: string | null;
          language: string | null;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          photo_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          role?: UserRole;
          email_verified?: boolean;
          theme?: string | null;
          language?: string | null;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          photo_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          role?: UserRole;
          email_verified?: boolean;
          theme?: string | null;
          language?: string | null;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          farmer_id: string;
          name: string;
          description: string;
          category: string;
          price_per_unit: number;
          unit: string;
          quantity: number;
          images: string[] | null;
          location_lat: number | null;
          location_lng: number | null;
          location_address: string | null;
          harvest_date: string | null;
          expiry_date: string | null;
          organic: boolean;
          status: ListingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          name: string;
          description: string;
          category: string;
          price_per_unit: number;
          unit: string;
          quantity: number;
          images?: string[] | null;
          location_lat?: number | null;
          location_lng?: number | null;
          location_address?: string | null;
          harvest_date?: string | null;
          expiry_date?: string | null;
          organic?: boolean;
          status?: ListingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          name?: string;
          description?: string;
          category?: string;
          price_per_unit?: number;
          unit?: string;
          quantity?: number;
          images?: string[] | null;
          location_lat?: number | null;
          location_lng?: number | null;
          location_address?: string | null;
          harvest_date?: string | null;
          expiry_date?: string | null;
          organic?: boolean;
          status?: ListingStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      group_buys: {
        Row: {
          id: string;
          organizer_id: string;
          listing_id: string;
          target_quantity: number;
          quantity_funded: number;
          deadline: string;
          participants: Record<string, number>;
          status: GroupBuyStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organizer_id: string;
          listing_id: string;
          target_quantity: number;
          quantity_funded?: number;
          deadline: string;
          participants?: Record<string, number>;
          status?: GroupBuyStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organizer_id?: string;
          listing_id?: string;
          target_quantity?: number;
          quantity_funded?: number;
          deadline?: string;
          participants?: Record<string, number>;
          status?: GroupBuyStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          group_buy_id: string;
          listing_id: string;
          quantity: number;
          amount: number;
          tx_ref: string;
          status: OrderStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          group_buy_id: string;
          listing_id: string;
          quantity: number;
          amount: number;
          tx_ref: string;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          group_buy_id?: string;
          listing_id?: string;
          quantity?: number;
          amount?: number;
          tx_ref?: string;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          amount: number;
          method: string;
          status: PaymentStatus;
          paystack_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          amount: number;
          method: string;
          status?: PaymentStatus;
          paystack_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          amount?: number;
          method?: string;
          status?: PaymentStatus;
          paystack_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          description: string;
          type: TransactionType;
          group_buy_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency?: string;
          description: string;
          type: TransactionType;
          group_buy_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          description?: string;
          type?: TransactionType;
          group_buy_id?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          order_id: string;
          buyer_id: string;
          farmer_id: string;
          rating: number;
          comment: string | null;
          images: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          buyer_id: string;
          farmer_id: string;
          rating: number;
          comment?: string | null;
          images?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          buyer_id?: string;
          farmer_id?: string;
          rating?: number;
          comment?: string | null;
          images?: string[] | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          message: string;
          is_read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          message: string;
          is_read?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          message?: string;
          is_read?: boolean;
          link?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      listing_status: ListingStatus;
      group_buy_status: GroupBuyStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      transaction_type: TransactionType;
    };
  };
}