/*
  Warnings:

  - You are about to drop the column `secretId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `txId` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "secretId",
DROP COLUMN "txId",
ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "clientSecret" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "keyPix" TEXT,
ADD COLUMN     "title" TEXT;
