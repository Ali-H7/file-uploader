/*
  Warnings:

  - A unique constraint covering the columns `[folder_id]` on the table `folder_shares` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "folder_shares" DROP CONSTRAINT "folder_shares_folder_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "folder_shares_folder_id_key" ON "folder_shares"("folder_id");

-- AddForeignKey
ALTER TABLE "folder_shares" ADD CONSTRAINT "folder_shares_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
