/*
  Warnings:

  - Added the required column `file_path` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_type` to the `File` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `file_size` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "file_path" VARCHAR(255) NOT NULL,
ADD COLUMN     "file_type" VARCHAR(50) NOT NULL,
DROP COLUMN "file_size",
ADD COLUMN     "file_size" INTEGER NOT NULL;
