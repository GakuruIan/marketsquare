/*
  Warnings:

  - You are about to drop the column `isActive` on the `Auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `Auth` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "isActive",
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_username_key" ON "Auth"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");
