/*
  Warnings:

  - You are about to drop the column `banExpires` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `banReason` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `banned` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "banExpires",
DROP COLUMN "banReason",
DROP COLUMN "banned";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "banExpires" TIMESTAMP(6),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN;
