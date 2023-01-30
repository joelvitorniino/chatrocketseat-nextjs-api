import { FastifyInstance } from 'fastify';
import fastifyPassport from '@fastify/passport';
import { googleAuthenticateHandler } from './google.controller';

export const googleRoute = async (app: FastifyInstance) => {
    app.get('/auth/google/callback', {
        preValidation: fastifyPassport.authenticate('google', { scope: ['email', 'profile'] })
    }, googleAuthenticateHandler);
};