/*
  Warnings:

  - The primary key for the `Machine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `QueueItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `lineId` on table `Machine` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `machineId` to the `QueueItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_lineId_fkey";

-- DropForeignKey
ALTER TABLE "QueueItem" DROP CONSTRAINT "QueueItem_lineId_fkey";

-- AlterTable
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "lineId" SET NOT NULL,
ADD CONSTRAINT "Machine_pkey" PRIMARY KEY ("id", "lineId");
DROP SEQUENCE "Machine_id_seq";

-- AlterTable
ALTER TABLE "QueueItem" DROP CONSTRAINT "QueueItem_pkey",
ADD COLUMN     "machineId" INTEGER NOT NULL,
ADD CONSTRAINT "QueueItem_pkey" PRIMARY KEY ("lineId", "machineId", "itemId");

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_machineId_lineId_fkey" FOREIGN KEY ("machineId", "lineId") REFERENCES "Machine"("id", "lineId") ON DELETE RESTRICT ON UPDATE CASCADE;
