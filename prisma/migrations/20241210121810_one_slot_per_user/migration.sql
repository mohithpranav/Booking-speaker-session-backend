/*
  Warnings:

  - A unique constraint covering the columns `[speakerId,date,timeSlot]` on the table `SpeakerAvailability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SpeakerAvailability_speakerId_date_timeSlot_key" ON "SpeakerAvailability"("speakerId", "date", "timeSlot");
