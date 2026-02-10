/*
  Warnings:

  - You are about to drop the `PasswordResetAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordResetSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPermssion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PasswordResetAttempt" DROP CONSTRAINT "PasswordResetAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetSession" DROP CONSTRAINT "PasswordResetSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermssion" DROP CONSTRAINT "UserPermssion_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermssion" DROP CONSTRAINT "UserPermssion_userId_fkey";

-- DropTable
DROP TABLE "PasswordResetAttempt";

-- DropTable
DROP TABLE "PasswordResetSession";

-- DropTable
DROP TABLE "UserPermssion";

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "token" TEXT,
    "refreshToken" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "deviceName" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_authId_idx" ON "sessions"("authId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_permissionId_key" ON "UserPermission"("userId", "permissionId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
