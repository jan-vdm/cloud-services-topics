-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_lineId_fkey";

-- AlterTable
ALTER TABLE "Machine" ALTER COLUMN "lineId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE SET NULL ON UPDATE CASCADE;
