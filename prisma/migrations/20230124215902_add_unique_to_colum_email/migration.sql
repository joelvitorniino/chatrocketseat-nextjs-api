/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Register` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Register_email_key" ON "Register"("email");
