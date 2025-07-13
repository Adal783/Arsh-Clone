import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          company: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          company?: string | null;
        };
        Update: {
          email?: string;
          name?: string;
          company?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string | null;
          address: string | null;
          company: string | null;
          status: 'Active' | 'Inactive' | 'Prospect';
          total_revenue: number;
          last_contact: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          company?: string | null;
          status?: 'Active' | 'Inactive' | 'Prospect';
          total_revenue?: number;
          notes?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          company?: string | null;
          status?: 'Active' | 'Inactive' | 'Prospect';
          total_revenue?: number;
          notes?: string | null;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          name: string;
          type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
          category: string;
          balance: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          code: string;
          name: string;
          type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
          category: string;
          balance?: number;
          is_active?: boolean;
        };
        Update: {
          code?: string;
          name?: string;
          type?: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
          category?: string;
          balance?: number;
          is_active?: boolean;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          number: string;
          date: string;
          due_date: string;
          amount: number;
          status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          customer_id: string;
          number: string;
          date?: string;
          due_date: string;
          amount: number;
          status?: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
          notes?: string | null;
        };
        Update: {
          customer_id?: string;
          number?: string;
          date?: string;
          due_date?: string;
          amount?: number;
          status?: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
          notes?: string | null;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          rate: number;
          amount: number;
          created_at: string;
        };
        Insert: {
          invoice_id: string;
          description: string;
          quantity?: number;
          rate: number;
          amount: number;
        };
        Update: {
          description?: string;
          quantity?: number;
          rate?: number;
          amount?: number;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          reference: string;
          description: string;
          debit_account: string;
          credit_account: string;
          amount: number;
          customer_id: string | null;
          status: 'Pending' | 'Approved' | 'Rejected';
          created_at: string;
        };
        Insert: {
          user_id: string;
          date?: string;
          reference: string;
          description: string;
          debit_account: string;
          credit_account: string;
          amount: number;
          customer_id?: string | null;
          status?: 'Pending' | 'Approved' | 'Rejected';
        };
        Update: {
          date?: string;
          reference?: string;
          description?: string;
          debit_account?: string;
          credit_account?: string;
          amount?: number;
          customer_id?: string | null;
          status?: 'Pending' | 'Approved' | 'Rejected';
        };
      };
    };
  };
}