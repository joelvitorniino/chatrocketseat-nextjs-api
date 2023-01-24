import { FastifyInstance } from 'fastify';
import { registerUserHandler, loginHandler, getUsersHandler } from './register.controller';
import { $ref } from './register.schema';

export const registerRoutes = async (app: FastifyInstance) => {
    app.post('/', {
        schema: {
            body: $ref('createRegisterSchema'),
            response: {
                201: $ref('createRegisterResponseSchema')
            }
        }
    }, registerUserHandler);
    
    app.post('/login', {
        schema: {
            body: $ref('loginSchema'),
            response: {
                200: $ref('loginResponseSchema')
            }
        }
    }, loginHandler);

    app.get('/', {
        preHandler: [app.authenticate]
    }, getUsersHandler);
};