/*
  Warnings:

  - A unique constraint covering the columns `[cloudinary_id]` on the table `file` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "file_cloudinary_id_key" ON "file"("cloudinary_id");
