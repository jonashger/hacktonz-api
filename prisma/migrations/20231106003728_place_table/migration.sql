/*
  Warnings:

  - You are about to drop the column `active` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `place` table. All the data in the column will be lost.
  - Added the required column `description` to the `place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "place" DROP COLUMN "active",
DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL;
