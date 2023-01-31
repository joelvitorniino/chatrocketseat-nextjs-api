import { FastifyRequest, FastifyReply } from "fastify";
import {
  createUser,
  findNameByEmail,
  findUserByEmail,
  findUsers,
} from "./register.service";
import { CreateUserInput, LoginInput } from "./register.schema";
import { app } from "../../server";
import { compare } from "bcryptjs";

import { z } from "zod";

declare module "fastify" {
  export interface FastifyRequest {
    authenticate: any;
  }
}

export const registerUserHandler = async (
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) => {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (e) {
    console.log(e);

    return reply.code(500).send(e);
  }
};

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  // find a user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email address or password",
    });
  }

  // verify password
  const correctPassword = await compare(body.password, user.password);

  // generate access token
  if (correctPassword) {
    const { password, ...rest } = user;

    return { accessToken: app.jwt.sign(rest) };
  }

  if (user.account_google) {
    const { password, ...rest } = user;

    return { accessToken: app.jwt.sign(rest) };
  }

  return reply.code(401).send({
    message: "Invalid email address or password",
  });
}

export const getUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.authenticate;

  const users = await findUsers();

  return users;
};

export const getUserNameHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const email = z.object({
    email: z.string(),
  });

  const user = await findNameByEmail(email.parse(request.body).email);

  return reply.code(200).send({ username: user.name });
};
