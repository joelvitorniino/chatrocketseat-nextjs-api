import { hashPassword } from "../../utils/hashPassword";
import { CreateUserInput } from "./register.schema"
import { PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient();

export const createUser = async (input: CreateUserInput) => {
    const {password, ...rest} = input;

    const passwordHash = hashPassword(password);
    
    const user = await prisma.register.create({
        data: {
            email: input.email,
            name: input.name,
            password: passwordHash,
        }
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
        }
    });
};