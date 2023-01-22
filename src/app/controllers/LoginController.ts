import { NextFunction, Request, Response } from "express";
import passport from "passport";

interface User {
    name_chat: string;
}

export class LoginController {
    index(request: Request, response: Response, next: NextFunction) {
        
    };

    getUser(request: Request, response: Response) {
        const user = request.user as User;

        if(!user) {
            return response.status(404).send("User not found!")
        };

        response.send(user);
    }
}