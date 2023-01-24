/*
  Warnings:

  - The primary key for the `Register` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email_chat` on the `Register` table. All the data in the column will be lost.
  - You are about to drop the column `id_chat` on the `Register` table. All the data in the column will be lost.
  - You are about to drop the column `name_chat` on the `Register` table. All the data in the column will be lost.
  - You are about to drop the column `password_chat` on the `Register` table. All the data in the column will be lost.
  - You are about to drop the column `password_chat_resetExpires` on the `Register` table. All the data in the column will be lost.
  - You are about to drop the column `password_chat_resetToken` on the `Register` table. All the data in the column will be lost.
  - Added the required column `email` to the `Register` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Register` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Register` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Register` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Register" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "password_resetToken" TEXT,
    "password_resetExpires" TEXT
);
DROP TABLE "Register";
ALTER TABLE "new_Register" RENAME TO "Register";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
