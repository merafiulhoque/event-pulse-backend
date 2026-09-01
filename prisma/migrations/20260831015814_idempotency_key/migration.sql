/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idempotencyKey` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "idempotencyKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_idempotencyKey_key" ON "Ticket"("idempotencyKey");
