/*
  Warnings:

  - Added the required column `slotsBooked` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "slotsBooked" INTEGER NOT NULL;
