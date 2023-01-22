import http from 'http';
import { Server } from 'socket.io'; 
import { config } from 'dotenv';
import fastifyCors from '@fastify/cors';
import fastifySession from '@fastify/session';
import fastifySecureSession from '@fastify/secure-session';
import fastifyCookie from '@fastify/cookie';
import fastifyPassport from '@fastify/passport';
import { passportConfig } from './utils/passportConfig';
import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { appRoutes } from './routes/routes';
import fastifySocket from 'fastify-socket.io';


const prisma = new PrismaClient({
    log: ['query']
});

const app = fastify();

config();

app.register(fastifySocket, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    transports: ['websocket']
});

app.register(fastifyCors, {
    origin: 'http://localhost:3000',
    credentials: true
});

app.register(fastifyCookie, {
    secret: process.env.SECRET_KEY
})


app.register(fastifySession, {
    secret: process.env.SECRET_KEY,
});

app.register(fastifyPassport.initialize())

app.register(fastifyPassport.secureSession());

passportConfig(fastifyPassport);

app.register(appRoutes);

app.ready(err => {
    if(err) throw err;

    app.io.on('connection', async (socket) => {
        console.log(`Socket connected: ${socket.id}`);
    
        setTimeout(async () => {
            const allMessages = await prisma.messages.findMany();
    
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
            await prisma.messages.create({
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
    port: 3001
})
    .then(url => console.log(url))
    .catch(err => console.log(err))