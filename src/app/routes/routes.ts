import { Request, Response, Router } from "express";

const router = Router();

router.get('/', (request: Request, response: Response) => {
    response.send("Hello, world!");
});

export { router };