/*
  Warnings:

  - You are about to drop the column `event_userId` on the `billing` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `billing` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `place` table. All the data in the column will be lost.
  - You are about to drop the `event_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `event_playerId` to the `billing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "billing" DROP CONSTRAINT "billing_event_userId_fkey";

-- DropForeignKey
ALTER TABLE "billing" DROP CONSTRAINT "billing_userId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "event_user" DROP CONSTRAINT "event_user_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event_user" DROP CONSTRAINT "event_user_playerId_fkey";

-- DropForeignKey
ALTER TABLE "place" DROP CONSTRAINT "place_userId_fkey";

-- AlterTable
ALTER TABLE "billing" DROP COLUMN "event_userId",
DROP COLUMN "userId",
ADD COLUMN     "event_playerId" TEXT NOT NULL,
ADD COLUMN     "playerId" TEXT;

-- AlterTable
ALTER TABLE "place" DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT;

-- DropTable
DROP TABLE "event_user";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "player" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_player" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_cpf_key" ON "player"("cpf");

-- AddForeignKey
ALTER TABLE "place" ADD CONSTRAINT "place_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_event_playerId_fkey" FOREIGN KEY ("event_playerId") REFERENCES "event_player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_player" ADD CONSTRAINT "event_player_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_player" ADD CONSTRAINT "event_player_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
