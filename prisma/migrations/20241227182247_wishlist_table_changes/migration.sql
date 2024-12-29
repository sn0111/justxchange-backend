/*
  Warnings:

  - The primary key for the `user_wishlists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address_id` on the `user_wishlists` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `user_wishlists` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `user_wishlists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_wishlists" DROP CONSTRAINT "user_wishlists_pkey",
DROP COLUMN "address_id",
DROP COLUMN "productId",
ADD COLUMN     "product_id" INTEGER NOT NULL,
ADD COLUMN     "wishlist_id" SERIAL NOT NULL,
ADD CONSTRAINT "user_wishlists_pkey" PRIMARY KEY ("wishlist_id");
