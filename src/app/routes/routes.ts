import { Request, Response, Router } from "express";
import { RegisterController } from "../controllers/RegisterController";
import { LoginController } from "../controllers/LoginController";

const registerController = new RegisterController();
const loginController = new LoginController();

const router = Router();

router.get('/api/v1/register', registerController.index);
router.post('/api/v1/register', registerController.store);

router.get('/api/v1/getUser', loginController.getUser);
router.post('/api/v1/login', loginController.index);

export { router };