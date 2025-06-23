-- Add profile fields to User
ALTER TABLE "User" ADD COLUMN "bio" TEXT;
ALTER TABLE "User" ADD COLUMN "website" VARCHAR(255);
ALTER TABLE "User" ADD COLUMN "location" VARCHAR(255);

-- Create UserPreferences table
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "videoQuality" TEXT NOT NULL DEFAULT 'auto',
    "autoPlay" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
    "notifyOnVideoComplete" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnCreditLow" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnNewFeatures" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnPromotions" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- Create unique index
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- Add foreign key
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create TwoFactorBackupCodes table
CREATE TABLE "TwoFactorBackupCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TwoFactorBackupCode_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "TwoFactorBackupCode_userId_idx" ON "TwoFactorBackupCode"("userId");
CREATE INDEX "TwoFactorBackupCode_code_idx" ON "TwoFactorBackupCode"("code");

-- Add foreign key
ALTER TABLE "TwoFactorBackupCode" ADD CONSTRAINT "TwoFactorBackupCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;