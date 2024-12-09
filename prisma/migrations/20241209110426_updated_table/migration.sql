/*
  Warnings:

  - You are about to drop the `Speaker` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" TEXT NOT NULL,
ALTER COLUMN "otp" DROP NOT NULL;

-- DropTable
DROP TABLE "Speaker";
