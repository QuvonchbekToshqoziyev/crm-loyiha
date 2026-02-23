/*
  Warnings:

  - You are about to drop the column `note` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "note",
ADD COLUMN     "late" BOOLEAN;

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "admin_status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
