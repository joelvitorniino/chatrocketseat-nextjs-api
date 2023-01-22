import passportLocal from "passport-local";
import { compare } from "bcryptjs";
import { Authenticator } from "@fastify/passport";
import { Strategy } from "@fastify/passport";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const passportConfig = (passport: Authenticator) => {
  passport.use(
    new passportLocal.Strategy(async (email, password, done) => {
      const user = await prisma.register.findFirst({ where: { email_chat: email } });

      try {

        if (!user) {
          done(null, false);
        };

        compare(password, user.password_chat, (err, response) => {
          if (err) throw err;

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        });
      } catch (e) {
        return null;
      }
    })
  );
  passport.registerUserSerializer(async (user: any, req) => user.id_chat);

  passport.registerUserDeserializer(async (id: number, req) => {
    try {
      const users = await prisma.register.findMany();

      if (!users) {
        return;
      };

      let userInfo;

      users.map(user => {
        userInfo = {
          id_chat: user.id_chat,
          name_chat: user.name_chat
        };

        return userInfo;
      });

      return userInfo;
    } catch (e) {
      return null;
    }
  });
};
