import { prisma } from "../../utils/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
import crypto from 'crypto';
import handlebars from 'handlebars';
import { readFileSync } from "fs";
import { Email } from "../../email/Email";
import { hashPassword } from "../../utils/hashPassword";

export const recoverPasswordHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const recoverPasswordData = z.object({
        email: z.string()
    });
    
    const { email } = recoverPasswordData.parse(request.body);

    try {
        const user = await prisma.register.findUnique({
            where: {
                email
            }
        });

        if(!user) {
            return reply.status(400).send({ error: 'User not found!' })
        };

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await prisma.register.update({
            where: {
                email: user.email
            },
            data: {
                password_resetToken: token,
                password_resetExpires: now.toDateString()
            }
        });

        const template = handlebars.compile(readFileSync(`${__dirname}/../../email/resources/forgot_password.html`, 'utf-8'));
        const htmlToSend = template({ token });

        const emailService = new Email();

        emailService.sendMail({
            name: 'Forgot Password'
        }, {
            email,
        }, {
            html: htmlToSend,
            text: null,
            subject: 'Forgot Password'
        })
    } catch(err) {
        if(err) {
            return reply.status(400).send({ error: 'Cannot send forgot password email' });
        }
    };
};

export const resetPasswordHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const resetPasswordData = z.object({
        email: z.string(),
        token: z.string(),
        password: z.string()
    });

    const { email, token, password } = resetPasswordData.parse(request.body);

    try {
        const user = await prisma.register.findUnique({
            where: {
                email
            }
        });

        if(!user) {
            return reply.status(400).send({ error: "User not found!" });
        };

        if(token !== user.password_resetToken) {
            return reply.status(400).send({ error: 'Token expired, generate a new one' });
        };

        await prisma.register.update({
            where: {
                email: user.email,
            },
            data: {
               password: hashPassword(password) 
            }
        });

        reply.send();
    } catch(e) {
        reply.status(400).send({ error: 'Cannot reset password, try again' });
    };
};