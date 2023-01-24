import { hashPassword } from "../../utils/hashPassword";
import { CreateUserInput } from "./register.schema"
import { PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient();

export const createUser = async (input: CreateUserInput) => {
    const {password, ...rest} = input;

    const passwordHash = hashPassword(password);
    
    const user = await prisma.user.create({
        data: { ...rest, password: passwordHash } 
    });

    return user;
};

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};  

export const findUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
        }
    });
};