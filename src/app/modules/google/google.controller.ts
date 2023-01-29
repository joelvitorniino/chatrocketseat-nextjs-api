import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify'; 
import z from 'zod';
import { app } from '../../server';
import { prisma } from '../../utils/prisma';

export const googleHandler = async(request: FastifyRequest, reply: FastifyReply) => {
    reply.redirect('/');
};


export const loginGoogleHandler = async(request: FastifyRequest, reply: FastifyReply) => {
    const user = z.object({
        email: z.string(),
    })
    const { email } = user.parse(request.body);

    const userData = await prisma.register.findUnique({
        where: {
            email
        }
    });

    const { password, ...rest } = userData; 

    return { accessToken: app.jwt.sign(rest) };
};