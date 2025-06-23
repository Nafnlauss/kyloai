-- Remove PayPal from payment_gateway enum
ALTER TYPE "PaymentGateway" RENAME TO "PaymentGateway_old";

CREATE TYPE "PaymentGateway" AS ENUM ('STRIPE', 'ASAAS', 'MANUAL', 'PROMOTIONAL');

-- Update existing records if needed
UPDATE "Transaction" 
SET "gateway" = 'STRIPE'::"PaymentGateway" 
WHERE "gateway" = 'PAYPAL'::"PaymentGateway_old";

-- Change column type
ALTER TABLE "Transaction" 
ALTER COLUMN "gateway" TYPE "PaymentGateway" USING "gateway"::text::"PaymentGateway";

-- Drop old enum
DROP TYPE "PaymentGateway_old";

-- Drop PayPal specific columns
ALTER TABLE "Transaction" 
DROP COLUMN IF EXISTS "paypalOrderId",
DROP COLUMN IF EXISTS "paypalCaptureId";

ALTER TABLE "User" 
DROP COLUMN IF EXISTS "paypalPayerId";

-- Drop PayPal related indexes
DROP INDEX IF EXISTS "Transaction_paypalOrderId_key";
DROP INDEX IF EXISTS "Transaction_paypalCaptureId_key";
DROP INDEX IF EXISTS "User_paypalPayerId_key";