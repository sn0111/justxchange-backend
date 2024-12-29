/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "last_login_otp" DROP DEFAULT,
ALTER COLUMN "role" SET DEFAULT 'user',
ALTER COLUMN "role" SET DATA TYPE VARCHAR(20);
