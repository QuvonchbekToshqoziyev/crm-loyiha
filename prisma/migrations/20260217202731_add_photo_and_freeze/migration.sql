-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'freeze';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "photo" TEXT;
