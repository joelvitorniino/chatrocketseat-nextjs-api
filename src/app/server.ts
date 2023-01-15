import express from 'express';
import { router } from './routes/routes';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import MessageController from './controllers/MessageController';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { passportConfig } from './utils/passportConfig';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    transports: ['websocket']
});

config();

app.use(express.json());

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false }))

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser(process.env.SECRET_KEY))

app.use(passport.initialize(  ))
app.use(passport.session());

passportConfig(passport);

app.use(router);

io.on('connect', async (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    const messageController = MessageController;

    setTimeout(async () => {
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
    }, 1500)

    socket.on("sendMessage", async ({ author, message }) => {
        await messageController.store({ author, message });

        socket.broadcast.emit("receivedMessage",  { author, message });
        console.log({ author, message });
    });
});

server.listen(process.env.PORT || 3001);