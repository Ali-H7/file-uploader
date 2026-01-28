-- CreateTable
CREATE TABLE "folder_shares" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder_id" INTEGER NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folder_shares_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "folder_shares" ADD CONSTRAINT "folder_shares_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder_shares" ADD CONSTRAINT "folder_shares_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
