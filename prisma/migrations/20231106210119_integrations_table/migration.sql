/*
  Warnings:

  - Added the required column `endToEnd` to the `billing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "billing" ADD COLUMN     "endToEnd" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Integrations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "client_id_mtls" VARCHAR(200),
    "client_secret_mtls" VARCHAR(200),
    "pfx_mtls" BYTEA,
    "passphrase_mtls" VARCHAR(200),
    "endpoint" VARCHAR(200),
    "pixKey" TEXT NOT NULL,

    CONSTRAINT "Integrations_pkey" PRIMARY KEY ("id")
);
