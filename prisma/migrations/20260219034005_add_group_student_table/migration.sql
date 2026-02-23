/*
  Warnings:

  - You are about to drop the `_GroupToStudent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GroupToStudent" DROP CONSTRAINT "_GroupToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToStudent" DROP CONSTRAINT "_GroupToStudent_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active',
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GroupToStudent";

-- CreateTable
CREATE TABLE "GroupStudent" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupStudent_group_id_student_id_key" ON "GroupStudent"("group_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "GroupStudent" ADD CONSTRAINT "GroupStudent_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupStudent" ADD CONSTRAINT "GroupStudent_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
