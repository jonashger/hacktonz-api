/*
  Warnings:

  - You are about to drop the column `organizerId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `modalityId` on the `place` table. All the data in the column will be lost.
  - You are about to drop the `Integrations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `modality_place_id` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_placeId_fkey";

-- DropForeignKey
ALTER TABLE "place" DROP CONSTRAINT "place_modalityId_fkey";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "organizerId",
DROP COLUMN "placeId",
ADD COLUMN     "modality_place_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "place" DROP COLUMN "modalityId";

-- DropTable
DROP TABLE "Integrations";

-- CreateTable
CREATE TABLE "modality_place" (
    "id" TEXT NOT NULL,
    "modality_id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "modality_place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "client_id_mtls" VARCHAR(200),
    "client_secret_mtls" VARCHAR(200),
    "pfx_mtls" BYTEA,
    "passphrase_mtls" VARCHAR(200),
    "endpoint" VARCHAR(200),
    "pixKey" TEXT NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "modality_place" ADD CONSTRAINT "modality_place_modality_id_fkey" FOREIGN KEY ("modality_id") REFERENCES "modality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modality_place" ADD CONSTRAINT "modality_place_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_modality_place_id_fkey" FOREIGN KEY ("modality_place_id") REFERENCES "modality_place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
