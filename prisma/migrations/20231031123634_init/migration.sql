/*
  Warnings:

  - You are about to drop the column `refresh_token_expires_in` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VerificationRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "refresh_token_expires_in";

-- AlterTable
ALTER TABLE "VerificationRequest" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
