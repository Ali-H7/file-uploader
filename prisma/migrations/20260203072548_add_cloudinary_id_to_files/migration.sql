/*
  Warnings:

  - Added the required column `cloudinary_id` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "cloudinary_id" VARCHAR(255) NOT NULL;
