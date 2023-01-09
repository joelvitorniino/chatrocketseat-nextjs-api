import { db } from "../db/db";
import { DataTypes } from 'sequelize'

export const messages = db.define('messages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: DataTypes.STRING,
    message: DataTypes.STRING
});