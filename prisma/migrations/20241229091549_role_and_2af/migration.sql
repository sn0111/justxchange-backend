-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_otp" TEXT DEFAULT 'user',
ADD COLUMN     "role" VARCHAR(200);
