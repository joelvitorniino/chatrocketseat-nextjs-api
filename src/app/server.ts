import { config } from "dotenv";

import fastifyCors from "@fastify/cors";
import fastify from "fastify";

import fastifySocket from "fastify-socket.io";
import fastifyJwt from "@fastify/jwt";

import fastifyPassport from "@fastify/passport";

import { FastifyRequest, FastifyReply } from "fastify";

import { PrismaClient } from "@prisma/client";
import { registerSchemas } from "./modules/register/register.schema";
import { registerRoutes } from "./modules/register/register.route";
import { passportConfig } from "./utils/passportConfig";
import { googleRoute } from "./modules/google/google.route";
import { recoverPasswordRoutes } from "./modules/recover_password/recover_password.routes";

const prisma = new PrismaClient({
  log: ["query"],
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

export const app = fastify();

config();

app.register(fastifyPassport.initialize());
app.register(fastifyPassport.secureSession());

app.register(fastifyJwt, {
  secret: process.env.HASH_SECRET as string,
  decoratorName: "authenticate",
});

app.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

app.register(registerRoutes, { prefix: "api/register" });
app.register(recoverPasswordRoutes);

for (const schema of registerSchemas) {
  app.addSchema(schema);
}

passportConfig(fastifyPassport);

app.register(googleRoute);

app.register(fastifySocket, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

app.register(fastifyCors, {
  origin: "http://localhost:3000",
  credentials: true,
});

app.ready((err) => {
  if (err) throw err;

  app.io.on("connection", async (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    setTimeout(async () => {
      const allMessages = await prisma.message.findMany();

      let messages;

      allMessages.forEach((data) => {
        messages = [
          {
            author: data.author,
            message: data.message,
          },
        ];

        socket.emit("previousMessages", messages);
      });
    }, 1500);

    socket.on("sendMessage", async ({ author, message }) => {
      await prisma.message.create({
        data: {
          author,
          message,
        },
      });

      socket.broadcast.emit("receivedMessage", { author, message });
      console.log({ author, message });
    });
  });
});

app
  .listen({
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 3001,
  })
  .then((url) => console.log(url))
  .catch((err) => console.log(err));
