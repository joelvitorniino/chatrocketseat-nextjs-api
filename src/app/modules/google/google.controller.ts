import { FastifyRequest, FastifyReply } from 'fastify'; 

export const googleHandler = async(request: FastifyRequest, reply: FastifyReply) => {
    reply.redirect('/');
};