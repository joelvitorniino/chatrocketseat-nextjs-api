/*
  Warnings:

  - You are about to alter the column `account_google` on the `Register` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Register" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "password_resetToken" TEXT,
    "password_resetExpires" TEXT,
    "account_google" BOOLEAN
);
INSERT INTO "new_Register" ("account_google", "email", "id", "name", "password", "password_resetExpires", "password_resetToken") SELECT "account_google", "email", "id", "name", "password", "password_resetExpires", "password_resetToken" FROM "Register";
DROP TABLE "Register";
ALTER TABLE "new_Register" RENAME TO "Register";
CREATE UNIQUE INDEX "Register_email_key" ON "Register"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
