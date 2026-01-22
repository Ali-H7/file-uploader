-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "folder_name" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FileToFolder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FileToFolder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FileToFolder_B_index" ON "_FileToFolder"("B");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToFolder" ADD CONSTRAINT "_FileToFolder_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToFolder" ADD CONSTRAINT "_FileToFolder_B_fkey" FOREIGN KEY ("B") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
