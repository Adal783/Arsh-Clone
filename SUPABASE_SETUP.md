# Supabase Setup Guide for AccounTech Pro

## 🎯 **What is Supabase?**

Supabase is a Backend-as-a-Service (BaaS) that provides:
- **Database**: PostgreSQL database in the cloud
- **Authentication**: User login/signup system
- **APIs**: Automatic REST and GraphQL APIs
- **Real-time**: Live data updates
- **Storage**: File uploads and management

Think of it as getting a complete backend without writing server code!

## 🚀 **Step 1: Create Supabase Project**

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up** with your GitHub account
3. **Create a new project**:
   - Project name: `accountech-pro`
   - Database password: `your-secure-password`
   - Region: Choose closest to you

## 🔧 **Step 2: Get Your Credentials**

After project creation, go to **Settings > API**:

```bash
# You'll need these values:
Project URL: https://your-project-id.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 **Step 3: Create Database Tables**

Go to **SQL Editor** in Supabase and run this:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  company TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Prospect')),
  total_revenue DECIMAL(10,2) DEFAULT 0,
  last_contact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table (Chart of Accounts)
CREATE TABLE public.accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense')),
  category TEXT NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, code)
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  number TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, number)
);

-- Create invoice items table
CREATE TABLE public.invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  rate DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference TEXT NOT NULL,
  description TEXT NOT NULL,
  debit_account UUID REFERENCES public.accounts(id) NOT NULL,
  credit_account UUID REFERENCES public.accounts(id) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Users can only see their own data)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own customers" ON public.customers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own accounts" ON public.accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own invoices" ON public.invoices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own invoice items" ON public.invoice_items
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM public.invoices WHERE id = invoice_id
  ));

CREATE POLICY "Users can manage own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔐 **Step 4: Configure Authentication**

In Supabase Dashboard:
1. Go to **Authentication > Settings**
2. **Site URL**: `http://localhost:3000` (for development)
3. **Redirect URLs**: `http://localhost:3000/auth/callback`
4. **Email Templates**: Customize if needed

## 💻 **Step 5: Update Your Frontend**

Install Supabase client:
```bash
npm install @supabase/supabase-js
```

## 🎯 **Step 6: Environment Variables**

Create `.env.local` (for Vite projects):
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📱 **Step 7: Test Your Setup**

1. **Start your app**: `npm start`
2. **Try to register** a new user
3. **Check Supabase Dashboard** > Authentication > Users
4. **Verify data** appears in your tables

## 🆘 **Common Issues & Solutions**

### Issue: "Invalid API key"
**Solution**: Double-check your environment variables

### Issue: "Row Level Security policy violation"
**Solution**: Make sure you're authenticated before making requests

### Issue: "Table doesn't exist"
**Solution**: Run the SQL commands in Supabase SQL Editor

### Issue: "CORS errors"
**Solution**: Add your domain to Supabase settings

## 🎉 **What You Get**

After setup, you'll have:
- ✅ **Real user authentication** (signup/login)
- ✅ **Persistent data storage** (no more mock data!)
- ✅ **Automatic APIs** for all your tables
- ✅ **Real-time updates** (data syncs across tabs)
- ✅ **Secure access** (users only see their data)
- ✅ **Scalable backend** (handles thousands of users)

## 🚀 **Next Steps**

1. **Complete the setup** following this guide
2. **Test basic functionality** (create customer, invoice)
3. **Deploy to production** (update environment variables)
4. **Add advanced features** (file uploads, real-time notifications)

Need help with any step? Let me know!