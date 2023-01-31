import { FastifyInstance } from "fastify";
import { recoverPasswordHandler, resetPasswordHandler } from "./recover_password.controller";

export const recoverPasswordRoutes = async (app: FastifyInstance) => {
    app.post('/recoverPassword', recoverPasswordHandler);
    app.post('/resetPassword', resetPasswordHandler);
};