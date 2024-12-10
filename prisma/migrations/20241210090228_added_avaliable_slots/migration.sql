/*
  Warnings:

  - You are about to drop the column `endTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeSlot` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeSlot" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SpeakerAvailability" (
    "id" SERIAL NOT NULL,
    "speakerId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "avaibableSlots" INTEGER NOT NULL DEFAULT 1,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SpeakerAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpeakerAvailability" ADD CONSTRAINT "SpeakerAvailability_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "SpeakerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
