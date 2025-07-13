import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];
type Customer = Tables['customers']['Row'];
type Account = Tables['accounts']['Row'];
type Invoice = Tables['invoices']['Row'] & {
  items: Tables['invoice_items']['Row'][];
  customer?: Customer;
};
type Transaction = Tables['transactions']['Row'];

export const useSupabase = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Authentication
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auth functions
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Customer functions
  const getCustomers = async (): Promise<Customer[]> => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const addCustomer = async (customer: Tables['customers']['Insert']) => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('customers')
      .insert({ ...customer, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const updateCustomer = async (id: string, updates: Tables['customers']['Update']) => {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  };

  // Account functions
  const getAccounts = async (): Promise<Account[]> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('code');
    
    if (error) throw error;
    return data || [];
  };

  const addAccount = async (account: Tables['accounts']['Insert']) => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('accounts')
      .insert({ ...account, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const updateAccount = async (id: string, updates: Tables['accounts']['Update']) => {
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const deleteAccount = async (id: string) => {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  };

  // Invoice functions
  const getInvoices = async (): Promise<Invoice[]> => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        items:invoice_items(*),
        customer:customers(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const addInvoice = async (
    invoice: Tables['invoices']['Insert'],
    items: Tables['invoice_items']['Insert'][]
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    // Insert invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({ ...invoice, user_id: user.id })
      .select()
      .single();
    
    if (invoiceError) throw invoiceError;
    
    // Insert invoice items
    const itemsWithInvoiceId = items.map(item => ({
      ...item,
      invoice_id: invoiceData.id
    }));
    
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId);
    
    if (itemsError) throw itemsError;
    
    return invoiceData;
  };

  const updateInvoice = async (id: string, updates: Tables['invoices']['Update']) => {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  // Transaction functions
  const getTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const addTransaction = async (transaction: Tables['transactions']['Insert']) => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  // Financial calculations
  const getTotalAssets = async (): Promise<number> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('type', 'Asset');
    
    if (error) throw error;
    return data?.reduce((sum, account) => sum + account.balance, 0) || 0;
  };

  const getTotalLiabilities = async (): Promise<number> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('type', 'Liability');
    
    if (error) throw error;
    return data?.reduce((sum, account) => sum + account.balance, 0) || 0;
  };

  const getTotalEquity = async (): Promise<number> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('type', 'Equity');
    
    if (error) throw error;
    return data?.reduce((sum, account) => sum + account.balance, 0) || 0;
  };

  const getTotalRevenue = async (): Promise<number> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('type', 'Revenue');
    
    if (error) throw error;
    return data?.reduce((sum, account) => sum + account.balance, 0) || 0;
  };

  const getTotalExpenses = async (): Promise<number> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('type', 'Expense');
    
    if (error) throw error;
    return data?.reduce((sum, account) => sum + account.balance, 0) || 0;
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getInvoices,
    addInvoice,
    updateInvoice,
    getTransactions,
    addTransaction,
    getTotalAssets,
    getTotalLiabilities,
    getTotalEquity,
    getTotalRevenue,
    getTotalExpenses
  };
};