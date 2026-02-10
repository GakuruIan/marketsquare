/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "refreshToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_refreshToken_key" ON "Auth"("refreshToken");
