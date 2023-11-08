/*
  Warnings:

  - You are about to drop the column `addressId` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `modality` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `place` table. All the data in the column will be lost.
  - Added the required column `address` to the `place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modalityId` to the `place` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "place" DROP CONSTRAINT "place_addressId_fkey";

-- DropForeignKey
ALTER TABLE "place" DROP CONSTRAINT "place_playerId_fkey";

-- AlterTable
ALTER TABLE "place" DROP COLUMN "addressId",
DROP COLUMN "modality",
DROP COLUMN "playerId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "modalityId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "modality" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "modality_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "place" ADD CONSTRAINT "place_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "modality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
