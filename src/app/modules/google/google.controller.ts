import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify'; 
import z from 'zod';
import { app } from '../../server';
import { prisma } from '../../utils/prisma';

export const googleHandler = async(request: FastifyRequest, reply: FastifyReply) => {
    reply.redirect('/');
};