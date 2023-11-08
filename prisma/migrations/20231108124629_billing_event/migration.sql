-- DropForeignKey
ALTER TABLE "billing" DROP CONSTRAINT "billing_event_playerId_fkey";

-- AlterTable
ALTER TABLE "billing" ADD COLUMN     "eventId" TEXT,
ALTER COLUMN "event_playerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_event_playerId_fkey" FOREIGN KEY ("event_playerId") REFERENCES "event_player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
