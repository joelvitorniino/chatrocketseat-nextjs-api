import { Authenticator } from '@fastify/passport';
import { config } from 'dotenv';
import { Strategy } from 'passport-google-oauth20';
import { prisma } from './prisma';
import { generateRandomPassword } from './generateRandomPassword';

config();

export const passportConfig = async (passport: Authenticator) => {
    passport.use('google', new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_KEY_SECRET,
        callbackURL: 'http://localhost:3001/auth/google/callback'
    }, async(accessToken: string, refreshToken, profile, cb: CallableFunction) => {

        const { name, email } = profile._json;

        const user = await prisma.register.findUnique({
            where: {
                email
            }
        });

        const password = generateRandomPassword({
            passwordLength: 40
        });

        if(!user) {
            await prisma.register.create({
                data: {
                    email,
                    name,
                    password,
                    account_google: true
                }
        })
        }

        return cb(undefined, profile)
    }));

    passport.registerUserDeserializer(async (id, reply) => {
        return id;
    });

    passport.registerUserSerializer(async (user, reply) => {
        return user;
     });
};