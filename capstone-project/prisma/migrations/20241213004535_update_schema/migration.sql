/*
  Warnings:

  - You are about to drop the column `listId` on the `Card` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "listId",
ADD COLUMN     "boardId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
