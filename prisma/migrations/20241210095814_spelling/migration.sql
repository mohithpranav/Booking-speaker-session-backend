/*
  Warnings:

  - You are about to drop the column `avaibableSlots` on the `SpeakerAvailability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SpeakerAvailability" DROP COLUMN "avaibableSlots",
ADD COLUMN     "availableSlots" INTEGER NOT NULL DEFAULT 1;
