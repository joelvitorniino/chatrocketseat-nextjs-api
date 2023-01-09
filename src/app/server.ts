import express from 'express';
import { router } from './routes/routes';
import http from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import { db } from './db/db';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(router);

io.on('connection', async (socket) => {
    console.log(`Socket connected: ${socket.id}`);
});

server.listen(process.env.PORT || 3001);