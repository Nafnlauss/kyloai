-- Add fields to track credit accumulation
ALTER TABLE "Subscription" 
ADD COLUMN IF NOT EXISTS "creditsAccumulative" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "totalCreditsGranted" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "creditsGrantedAt" TIMESTAMP(3);

-- Add field to track when credits were last reset for monthly plans
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "creditsLastReset" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Create a credit history table to track credit grants and usage
CREATE TABLE IF NOT EXISTS "CreditHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL, -- 'GRANTED', 'USED', 'PURCHASED', 'EXPIRED'
    "description" TEXT,
    "subscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditHistory_pkey" PRIMARY KEY ("id")
);

-- Add indexes
CREATE INDEX IF NOT EXISTS "CreditHistory_userId_idx" ON "CreditHistory"("userId");
CREATE INDEX IF NOT EXISTS "CreditHistory_createdAt_idx" ON "CreditHistory"("createdAt");

-- Add foreign key
ALTER TABLE "CreditHistory" 
ADD CONSTRAINT "CreditHistory_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CreditHistory" 
ADD CONSTRAINT "CreditHistory_subscriptionId_fkey" 
FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;