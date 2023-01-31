import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../utils/prisma";
import { findUserByEmail } from "../register/register.service";
import { app } from "../../server";

interface User {
  _json: {
    email: string;
  };
}

export const googleAuthenticateHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as User;

  const userGoogle = await prisma.register.findUnique({
    where: {
      email: user._json.email,
    },
  });

  if (!userGoogle) {
    return reply.status(403);
  }

  return reply.redirect("http://localhost:3000/chat_google");
};

export const googleAccessTokenHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as User;

  const userData = await findUserByEmail(user._json.email);

  if (!userData) {
    return reply.status(403);
  }

  const { password, ...rest } = userData;

  return {
    email: user._json.email,
    accessToken: app.jwt.sign(rest),
  };
};
