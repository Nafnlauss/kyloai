-- Remove PayPal from payment_gateway enum
ALTER TYPE payment_gateway RENAME TO payment_gateway_old;

CREATE TYPE payment_gateway AS ENUM ('STRIPE', 'ASAAS', 'MANUAL', 'PROMOTIONAL');

-- Update existing records if needed
UPDATE transactions 
SET gateway = 'STRIPE'::payment_gateway 
WHERE gateway = 'PAYPAL'::payment_gateway_old;

-- Change column type
ALTER TABLE transactions 
ALTER COLUMN gateway TYPE payment_gateway USING gateway::text::payment_gateway;

-- Drop old enum
DROP TYPE payment_gateway_old;

-- Drop PayPal specific columns
ALTER TABLE transactions 
DROP COLUMN IF EXISTS paypal_order_id,
DROP COLUMN IF EXISTS paypal_capture_id;

ALTER TABLE users 
DROP COLUMN IF EXISTS paypal_payer_id;