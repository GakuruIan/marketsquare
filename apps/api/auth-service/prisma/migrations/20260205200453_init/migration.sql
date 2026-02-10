/*
  Warnings:

  - You are about to drop the column `userId` on the `VerificationCode` table. All the data in the column will be lost.
  - Added the required column `authId` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_userId_fkey";

-- DropIndex
DROP INDEX "VerificationCode_userId_idx";

-- AlterTable
ALTER TABLE "VerificationCode" DROP COLUMN "userId",
ADD COLUMN     "authId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Auth_username_idx" ON "Auth"("username");

-- CreateIndex
CREATE INDEX "Auth_userId_idx" ON "Auth"("userId");

-- CreateIndex
CREATE INDEX "VerificationCode_authId_idx" ON "VerificationCode"("authId");

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
