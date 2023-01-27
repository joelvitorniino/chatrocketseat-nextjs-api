import { Authenticator } from '@fastify/passport';
import { config } from 'dotenv';
import { Strategy } from 'passport-google-oauth20';

config();

export const passportConfig = async (passport: Authenticator) => {
    passport.use('google', new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_KEY_SECRET,
        callbackURL: 'http://localhost:3001/auth/google/callback'
    }, (accessToken: string, refreshToken, profile, cb: CallableFunction) => {
        cb(undefined, profile);
        console.log(profile);
    }));

    passport.registerUserDeserializer(async (id, reply) => {
        return id;
    });

    passport.registerUserSerializer(async (user, reply) => {
        return user;
     });
};