-- DropForeignKey
ALTER TABLE "file_shares" DROP CONSTRAINT "file_shares_file_id_fkey";

-- AddForeignKey
ALTER TABLE "file_shares" ADD CONSTRAINT "file_shares_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
