import { Authenticator } from '@fastify/passport';
import { PrismaClient, prisma } from '@prisma/client';
import { config } from 'dotenv';
import { Strategy } from 'passport-google-oauth20';

config();

export const passportConfig = async (passport: Authenticator) => {
    passport.use('google', new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_KEY_SECRET,
        callbackURL: 'http://localhost:3001/auth/google/callback'
    }, async(accessToken: string, refreshToken, profile, cb: CallableFunction) => {

        const { name, email } = profile._json;
        
        const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const passwordLength = 12;
        let password = "";

        for (let i = 0; i <= passwordLength; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber +1);
        };

        const user = await new PrismaClient({}).register.findUnique({
            where: {
                email
            }
        })

        if(!user) {
            await new PrismaClient({}).register.create({
                data: {
                    email,
                    name,
                    password
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