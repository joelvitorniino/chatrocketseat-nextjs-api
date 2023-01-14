import { Request, Response, Router } from "express";
import { RegisterController } from "../controllers/RegisterController";

const registerController = new RegisterController();

const router = Router();

router.get('/api/v1/register', registerController.index);
router.post('/api/v1/register', registerController.store);

export { router };