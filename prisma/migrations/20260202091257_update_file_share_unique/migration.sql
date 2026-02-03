/*
  Warnings:

  - A unique constraint covering the columns `[file_id]` on the table `file_shares` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "file_shares_file_id_key" ON "file_shares"("file_id");
