-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'MODERATOR');
CREATE TYPE video_provider AS ENUM ('LUMA', 'KLING');
CREATE TYPE video_status AS ENUM ('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELLED', 'PAUSED', 'TRIALING', 'INCOMPLETE');
CREATE TYPE billing_interval AS ENUM ('MONTHLY', 'YEARLY', 'LIFETIME');
CREATE TYPE transaction_type AS ENUM ('SUBSCRIPTION', 'SUBSCRIPTION_RENEWAL', 'ONE_TIME_PURCHASE', 'CREDIT_PURCHASE', 'REFUND', 'CHARGEBACK');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'DISPUTED', 'CANCELLED');
CREATE TYPE payment_gateway AS ENUM ('STRIPE', 'PAYPAL', 'MANUAL', 'PROMOTIONAL');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified TIMESTAMPTZ,
    name VARCHAR(255),
    password_hash TEXT,
    image TEXT,
    credits INTEGER DEFAULT 10,
    role user_role DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    stripe_customer_id VARCHAR(255) UNIQUE,
    paypal_payer_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_stripe_customer_id ON public.users(stripe_customer_id);

-- Accounts table (for OAuth providers)
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_sessions_session_token ON public.sessions(session_token);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);

-- API Keys table
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_key ON public.api_keys(key);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);

-- Audit logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    resource_id VARCHAR(255),
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Plans table
CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    monthly_price INTEGER NOT NULL,
    yearly_price INTEGER,
    monthly_credits INTEGER NOT NULL,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    max_video_duration INTEGER NOT NULL,
    max_video_resolution VARCHAR(20) DEFAULT '720p',
    allow_commercial_use BOOLEAN DEFAULT false,
    allow_hd BOOLEAN DEFAULT false,
    watermark BOOLEAN DEFAULT true,
    priority_queue BOOLEAN DEFAULT false
);

CREATE INDEX idx_plans_name ON public.plans(name);

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id),
    status subscription_status NOT NULL,
    interval billing_interval NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    credits INTEGER,
    type transaction_type NOT NULL,
    status payment_status NOT NULL,
    gateway payment_gateway NOT NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    paypal_order_id VARCHAR(255) UNIQUE,
    paypal_capture_id VARCHAR(255) UNIQUE,
    metadata JSONB,
    description TEXT,
    invoice_url TEXT,
    receipt_url TEXT,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Videos table
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    enhanced_prompt TEXT,
    provider video_provider NOT NULL,
    provider_job_id VARCHAR(255),
    status video_status NOT NULL,
    url TEXT,
    thumbnail_url TEXT,
    preview_url TEXT,
    duration INTEGER,
    resolution VARCHAR(20),
    aspect_ratio VARCHAR(10),
    file_size INTEGER,
    mime_type VARCHAR(50),
    credits_used INTEGER NOT NULL,
    is_public BOOLEAN DEFAULT false,
    allow_download BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    processing_started_at TIMESTAMPTZ,
    processing_ended_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    metadata JSONB,
    tags JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_user_id ON public.videos(user_id);
CREATE INDEX idx_videos_status ON public.videos(status);
CREATE INDEX idx_videos_provider ON public.videos(provider);
CREATE INDEX idx_videos_created_at ON public.videos(created_at);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Videos policies
CREATE POLICY "Users can view own videos" ON public.videos
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own videos" ON public.videos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos" ON public.videos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos" ON public.videos
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Plans are public
CREATE POLICY "Anyone can view plans" ON public.plans
    FOR SELECT USING (is_active = true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();