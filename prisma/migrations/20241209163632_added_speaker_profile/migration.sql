-- CreateTable
CREATE TABLE "SpeakerProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "expertise" TEXT NOT NULL,
    "PricePerSession" INTEGER NOT NULL,

    CONSTRAINT "SpeakerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpeakerProfile_userId_key" ON "SpeakerProfile"("userId");

-- AddForeignKey
ALTER TABLE "SpeakerProfile" ADD CONSTRAINT "SpeakerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
