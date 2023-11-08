/*
  Warnings:

  - You are about to drop the column `email` on the `player` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `player` table. All the data in the column will be lost.
  - Added the required column `password` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "player" DROP COLUMN "email",
DROP COLUMN "password";
