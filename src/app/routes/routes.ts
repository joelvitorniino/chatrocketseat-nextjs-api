import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';

import { PrismaClient } from '@prisma/client';
import { hashPassword } from "../utils/hashPassword";

import passport from "passport";

const prisma = new PrismaClient();

interface User {
    name_chat: string;
}

export const appRoutes = async (app: FastifyInstance) => {
    app.post('/register', async (request: FastifyRequest) => {
        const createAccount = z.object({
            name_chat: z.string(),
            email_chat: z.string(),
            password_chat: z.string()
        });

        const { name_chat, email_chat, password_chat } = createAccount.parse(request.body);
        const passwordHash = hashPassword(password_chat);
        
        const data = await prisma.register.create({
            data: {
                name_chat,
                email_chat,
                password_chat: passwordHash,
                password_chat_resetExpires: '',
                password_chat_resetToken: ''
            }
        });

        return data;
    });

    app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        passport.authenticate('local', (err, user, info) => {
            if(err) throw err;

            if(!user) {
                reply.status(403).send('No user exists!');
            };

            if(user) {
                request.login(user)
                    .then((data) => {
                             
                        reply.send("User logged in")
                        console.log(user);
                    })
            };

            return reply.send(request.user)
        });
    });

    app.get('/getUser', (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user;

        reply.send(user);
    })
}