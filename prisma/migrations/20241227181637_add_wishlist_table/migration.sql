-- CreateTable
CREATE TABLE "user_wishlists" (
    "id" UUID NOT NULL,
    "address_id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_wishlists_pkey" PRIMARY KEY ("address_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_wishlists_id_key" ON "user_wishlists"("id");
