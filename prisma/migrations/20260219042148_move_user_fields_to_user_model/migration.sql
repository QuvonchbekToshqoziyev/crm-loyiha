/*
  Warnings:

  - You are about to drop the column `first_name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- First, add columns as nullable to User
ALTER TABLE "User" ADD COLUMN "first_name" TEXT;
ALTER TABLE "User" ADD COLUMN "last_name" TEXT;
ALTER TABLE "User" ADD COLUMN "photo" TEXT;

-- Set default values for existing users from their Teacher/Student records or use 'Admin'/'SuperAdmin'
UPDATE "User" u
SET 
  first_name = COALESCE(
    (SELECT t.first_name FROM "Teacher" t WHERE t.user_id = u.id),
    (SELECT s.first_name FROM "Student" s WHERE s.user_id = u.id),
    'Super'
  ),
  last_name = COALESCE(
    (SELECT t.last_name FROM "Teacher" t WHERE t.user_id = u.id),
    (SELECT s.last_name FROM "Student" s WHERE s.user_id = u.id),
    'Admin'
  ),
  photo = COALESCE(
    (SELECT t.photo FROM "Teacher" t WHERE t.user_id = u.id),
    (SELECT s.photo FROM "Student" s WHERE s.user_id = u.id)
  );

-- Now make first_name and last_name NOT NULL
ALTER TABLE "User" ALTER COLUMN "first_name" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "last_name" SET NOT NULL;

-- AlterTable Student - remove personal fields
ALTER TABLE "Student" DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "photo",
DROP COLUMN "status";

-- AlterTable Teacher - remove personal fields
ALTER TABLE "Teacher" DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "photo",
DROP COLUMN "status";
