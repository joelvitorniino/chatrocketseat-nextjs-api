import { db } from "../db/db";
import { DataTypes } from "sequelize";

export const Register = db.define('users', {
    id_chat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name_chat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    email_chat: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password_chat: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password_chat_resetToken: DataTypes.STRING,
    password_chat_resetExpires: DataTypes.STRING
}, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: false
});