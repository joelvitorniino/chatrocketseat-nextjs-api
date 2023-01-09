import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

export const db = new Sequelize({
    host: process.env.MYSQL_HOSTNAME,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    logging: true,
    dialect: 'mysql'
});