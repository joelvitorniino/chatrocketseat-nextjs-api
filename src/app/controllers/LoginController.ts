import { NextFunction, Request, Response } from "express";
import passport from "passport";

interface User {
    name_chat: string;
}

export class LoginController {
    index(request: Request, response: Response, next: NextFunction) {
        passport.authenticate('local', (err, user, info) => {
            if(err) throw err;

            if(!user) {
                response.status(403).send("No user exists!");
            };

            if(user) {
                request.login(user, err => {
                    if(err) throw err;
                    
                    response.send("User logged in")
                    console.log(user);
                });
            }
        })(request, response, next);
    };

    getUser(request: Request, response: Response) {
        const user = request.user as User;
        response.send(user);
    }
}