import { FastifyRequest, FastifyReply } from 'fastify'; 
import { prisma } from '../../utils/prisma';
import { app } from '../../server';

interface User {
    _json: {
        email: string;
    }
}


export const googleAuthenticateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as User;

    const userGoogle = await prisma.register.findUnique({
        where: {
            email: user._json.email,
        }
    });

    if(!userGoogle) {
        return reply.status(403);
    };

    const { password, ...rest } = userGoogle

    return {
        accessToken: app.jwt.sign(rest)
    } && reply.redirect('http://localhost:3000/chat')
};