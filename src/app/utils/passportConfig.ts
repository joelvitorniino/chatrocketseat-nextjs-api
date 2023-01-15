import { PassportStatic } from "passport";
import passportLocal from "passport-local";
import { RegisterRepository } from "../repositories/RegisterRepository";
import { compare } from "bcryptjs";

export const passportConfig = (passport: PassportStatic) => {
  passport.use(
    new passportLocal.Strategy(async (email, password, done) => {
      const registerRepository = new RegisterRepository();
      const user = await registerRepository.findOne({ email_chat: email });

      try {
        const jsonStringify = JSON.stringify(user.toJSON());
        const jsonParse = JSON.parse(jsonStringify);

        if (!user) {
          done(null, false);
        }

        compare(password, jsonParse.password_chat, (err, response) => {
          if (err) throw err;

          if (!jsonParse) {
            return done(null, false);
          }

          return done(null, jsonParse);
        });
      } catch (e) {
        return null;
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id_chat);
  });

  passport.deserializeUser(async (id: number, done) => {
    const registerRepository = new RegisterRepository();
    const user = await registerRepository.findById(id);

    try {
      const jsonStringify = JSON.stringify(user.toJSON());
      const jsonParse = JSON.parse(jsonStringify);

      if (!user) {
        return done(null, false);
      }

      const userInfo = {
        id_chat: jsonParse.id_chat,
        name_chat: jsonParse.name_chat,
      };

      return done(null, userInfo);
    } catch (e) {
      return null;
    }
  });
};
