import express from 'express';
import { router } from './routes/routes';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import { db } from './db/db';
import MessageController from './controllers/MessageController';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(router);

io.on('connection', async (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const messageController = MessageController;

    const messageIndex = await messageController.index();
    const jsonStringify = JSON.stringify(messageIndex.map((data => data.toJSON())));

    const jsonParse = JSON.parse(jsonStringify);

    let messages;

    jsonParse.forEach((data) => {
        messages = [
            {
                author: data.author,
                message: data.message
            }
        ];

        socket.emit("previousMessages", messages);
    });

    socket.on("sendMessage", async ({ author, message }) => {
        // await messageController.store({ author, message });

        socket.broadcast.emit("receivedMessage",    { author, message });
        console.log({ author, message });
    });
});

server.listen(process.env.PORT || 3001);