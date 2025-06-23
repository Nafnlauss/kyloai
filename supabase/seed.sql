-- Insert default plans
INSERT INTO public.plans (
    id,
    name,
    display_name,
    description,
    monthly_price,
    yearly_price,
    monthly_credits,
    features,
    is_active,
    sort_order,
    max_video_duration,
    max_video_resolution,
    allow_commercial_use,
    allow_hd,
    watermark,
    priority_queue
) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'starter',
    'Starter',
    'Perfect for trying out AI video generation',
    999, -- $9.99 in cents
    NULL,
    50,
    '{"features": ["50 video credits", "Basic AI models", "720p resolution", "Standard processing", "Email support"]}'::jsonb,
    true,
    1,
    5, -- 5 seconds
    '720p',
    false,
    false,
    true,
    false
),
(
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'creator',
    'Creator',
    'Ideal for content creators and small businesses',
    2999, -- $29.99 in cents
    32999, -- $329.99 yearly (save ~$30)
    200,
    '{"features": ["200 video credits", "All AI models", "1080p HD resolution", "Priority processing", "No watermark", "Priority support"]}'::jsonb,
    true,
    2,
    10, -- 10 seconds
    '1080p',
    true,
    true,
    false,
    true
),
(
    'c3d4e5f6-a7b8-9012-cdef-345678901234',
    'professional',
    'Professional',
    'For teams and heavy users',
    6999, -- $69.99 in cents
    76999, -- $769.99 yearly (save ~$70)
    500,
    '{"features": ["500 video credits", "All AI models", "4K resolution", "Fastest processing", "No watermark", "API access", "Dedicated support"]}'::jsonb,
    true,
    3,
    15, -- 15 seconds
    '4K',
    true,
    true,
    false,
    true
);

-- Add sample user for testing (optional - remove in production)
-- Password: Test1234!
-- INSERT INTO auth.users (
--     id,
--     email,
--     encrypted_password,
--     email_confirmed_at,
--     created_at,
--     updated_at
-- ) VALUES (
--     'd4e5f6a7-b8c9-0123-def4-567890123456',
--     'test@kyloai.com',
--     '$2a$10$PkKqFhXPQDz7XnVqYJ.x9.jFvZRMsjJYqGO7EBqjBKgTnH9MxRhOe',
--     NOW(),
--     NOW(),
--     NOW()
-- );

-- INSERT INTO public.users (
--     id,
--     email,
--     email_verified,
--     name,
--     password_hash,
--     credits,
--     role,
--     is_active
-- ) VALUES (
--     'd4e5f6a7-b8c9-0123-def4-567890123456',
--     'test@kyloai.com',
--     NOW(),
--     'Test User',
--     '$2a$10$PkKqFhXPQDz7XnVqYJ.x9.jFvZRMsjJYqGO7EBqjBKgTnH9MxRhOe',
--     10,
--     'USER',
--     true
-- );