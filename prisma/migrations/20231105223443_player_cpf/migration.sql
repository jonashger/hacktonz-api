-- DropIndex
DROP INDEX "player_cpf_key";

-- AlterTable
ALTER TABLE "player" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
