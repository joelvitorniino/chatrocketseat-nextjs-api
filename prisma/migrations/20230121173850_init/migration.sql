-- CreateTable
CREATE TABLE "Messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL,
    "message" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Register" (
    "id_chat" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_chat" TEXT NOT NULL,
    "email_chat" TEXT NOT NULL,
    "password_chat" TEXT NOT NULL,
    "password_chat_resetToken" TEXT NOT NULL,
    "password_chat_resetExpires" TEXT NOT NULL
);
