import { hashPassword } from "../../utils/hashPassword";
import { CreateUserInput } from "./register.schema";
import { prisma } from "../../utils/prisma";

export const createUser = async (input: CreateUserInput) => {
  const { password, ...rest } = input;

  const passwordHash = hashPassword(password);

  const user = await prisma.register.create({
    data: {
      email: input.email,
      name: input.name,
      password: passwordHash,
    },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.register.findUnique({ where: { email } });
};

export const findUsers = async () => {
  return prisma.register.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
};

export const findNameByEmail = async (email: string) => {
  return await prisma.register.findUnique({
    where: {
      email,
    },
    select: {
      email: false,
      id: false,
      name: true,
      password: false,
    },
  });
};
