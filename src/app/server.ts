import { config } from 'dotenv';

import fastifyCors from '@fastify/cors';
import fastify from 'fastify';

import fastifySocket from 'fastify-socket.io';
import fastifyJwt from '@fastify/jwt';

import { FastifyRequest, FastifyReply } from 'fastify';

import { PrismaClient } from '@prisma/client';
import { registerSchemas } from './modules/register/register.schema';
import { registerRoutes } from './modules/register/register.route';

const prisma = new PrismaClient({
    log: ['query']
});

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
    }
}

export const app = fastify();

config();

app.register(fastifyJwt, {
    secret: process.env.HASH_SECRET as string,
});

app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch(e) {
        return reply.send(e);
    }
});

app.register(registerRoutes, { prefix: "api/register" });

for(const schema of registerSchemas) {
    app.addSchema(schema);
};

app.register(fastifySocket, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    transports: ['websocket']
});

app.register(fastifyCors, {
    origin: '*',
    credentials: true
});

app.ready(err => {
    if(err) throw err;

    app.io.on('connection', async (socket) => {
        console.log(`Socket connected: ${socket.id}`);
    
        setTimeout(async () => {
            const allMessages = await prisma.message.findMany();
    
            let messages;
    
            allMessages.forEach((data) => {
                messages = [
                    {
                        author: data.author,
                        message: data.message
                    }
                ];
    
                socket.emit("previousMessages", messages);
            });
        }, 1500)
    
        socket.on("sendMessage", async ({ author, message }) => {
            await prisma.message.create({
                data: {
                    author,
                    message
                }
            });
    
            socket.broadcast.emit("receivedMessage",  { author, message });
            console.log({ author, message });
        });
    });
});

app.listen({
    port: Number(process.env.PORT) || 3001
})
    .then(url => console.log(url))
    .catch(err => console.log(err))
