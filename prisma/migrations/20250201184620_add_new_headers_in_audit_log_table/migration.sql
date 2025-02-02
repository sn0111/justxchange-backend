/*
  Warnings:

  - You are about to drop the column `entity` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `audit_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "entity",
DROP COLUMN "entityId",
ADD COLUMN     "isMobile" TEXT,
ADD COLUMN     "platform" TEXT;
