/*
  Warnings:

  - You are about to drop the column `asaasPaymentId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `asaasCustomerId` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "credits" INTEGER,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "paypalOrderId" TEXT,
    "paypalCaptureId" TEXT,
    "metadata" TEXT,
    "description" TEXT,
    "invoiceUrl" TEXT,
    "receiptUrl" TEXT,
    "failureReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "createdAt", "credits", "currency", "description", "failureReason", "gateway", "id", "invoiceUrl", "metadata", "processedAt", "receiptUrl", "status", "stripePaymentIntentId", "type", "userId") SELECT "amount", "createdAt", "credits", "currency", "description", "failureReason", "gateway", "id", "invoiceUrl", "metadata", "processedAt", "receiptUrl", "status", "stripePaymentIntentId", "type", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_stripePaymentIntentId_key" ON "Transaction"("stripePaymentIntentId");
CREATE UNIQUE INDEX "Transaction_paypalOrderId_key" ON "Transaction"("paypalOrderId");
CREATE UNIQUE INDEX "Transaction_paypalCaptureId_key" ON "Transaction"("paypalCaptureId");
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "passwordHash" TEXT,
    "image" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 10,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "lastLoginAt" DATETIME,
    "lastLoginIp" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "stripeCustomerId" TEXT,
    "paypalPayerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "credits", "email", "emailVerified", "failedLoginAttempts", "id", "image", "isActive", "lastLoginAt", "lastLoginIp", "lockedUntil", "name", "passwordHash", "role", "stripeCustomerId", "twoFactorEnabled", "twoFactorSecret", "updatedAt") SELECT "createdAt", "credits", "email", "emailVerified", "failedLoginAttempts", "id", "image", "isActive", "lastLoginAt", "lastLoginIp", "lockedUntil", "name", "passwordHash", "role", "stripeCustomerId", "twoFactorEnabled", "twoFactorSecret", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_paypalPayerId_key" ON "User"("paypalPayerId");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
