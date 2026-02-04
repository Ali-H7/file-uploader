/*
  Warnings:

  - A unique constraint covering the columns `[url_id]` on the table `folder` will be added. If there are existing duplicate values, this will fail.
  - The required column `url_id` was added to the `folder` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "folder" ADD COLUMN     "url_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "folder_url_id_key" ON "folder"("url_id");
