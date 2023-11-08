/*
  Warnings:

  - Made the column `individualValue` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "event" ALTER COLUMN "individualValue" SET NOT NULL;
