-- Add referral fields to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "referralCode" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "referredById" TEXT REFERENCES "User"("id");

-- Add indexes for referral fields
CREATE INDEX IF NOT EXISTS "User_referralCode_idx" ON "User"("referralCode");
CREATE INDEX IF NOT EXISTS "User_referredById_idx" ON "User"("referredById");

-- Add metadata field to UserPreferences
ALTER TABLE "UserPreferences"
ADD COLUMN IF NOT EXISTS "metadata" TEXT;

-- Create ReferralEarning table
CREATE TABLE IF NOT EXISTS "ReferralEarning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL UNIQUE,
    "amount" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    
    CONSTRAINT "ReferralEarning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralEarning_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralEarning_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for ReferralEarning
CREATE INDEX IF NOT EXISTS "ReferralEarning_userId_idx" ON "ReferralEarning"("userId");
CREATE INDEX IF NOT EXISTS "ReferralEarning_referredUserId_idx" ON "ReferralEarning"("referredUserId");
CREATE INDEX IF NOT EXISTS "ReferralEarning_status_idx" ON "ReferralEarning"("status");
CREATE INDEX IF NOT EXISTS "ReferralEarning_createdAt_idx" ON "ReferralEarning"("createdAt");

-- Create ReferralPayout table
CREATE TABLE IF NOT EXISTS "ReferralPayout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "cryptoAddress" TEXT,
    "cryptoNetwork" TEXT,
    "transactionHash" TEXT,
    "bankAccount" TEXT,
    "metadata" TEXT,
    "processedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    
    CONSTRAINT "ReferralPayout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for ReferralPayout
CREATE INDEX IF NOT EXISTS "ReferralPayout_userId_idx" ON "ReferralPayout"("userId");
CREATE INDEX IF NOT EXISTS "ReferralPayout_status_idx" ON "ReferralPayout"("status");
CREATE INDEX IF NOT EXISTS "ReferralPayout_createdAt_idx" ON "ReferralPayout"("createdAt");

-- Create ReferralStats table
CREATE TABLE IF NOT EXISTS "ReferralStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "activeReferrals" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" INTEGER NOT NULL DEFAULT 0,
    "pendingEarnings" INTEGER NOT NULL DEFAULT 0,
    "paidEarnings" INTEGER NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "ReferralStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create index for ReferralStats
CREATE INDEX IF NOT EXISTS "ReferralStats_userId_idx" ON "ReferralStats"("userId");

-- Add foreign key constraint for ReferralPayout to ReferralEarning
ALTER TABLE "ReferralEarning" 
ADD CONSTRAINT "ReferralEarning_payoutId_fkey" 
FOREIGN KEY ("payoutId") REFERENCES "ReferralPayout"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;