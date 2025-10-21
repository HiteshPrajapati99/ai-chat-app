import { Router } from "express";
import validateReq from "../../middlewares/validateReq";
import authController from "./controller";
import { userSchema } from "./schema";

const { register, login, logout } = authController;

const router = Router();

router.post("/register", validateReq(userSchema), register);

router.post("/login", validateReq(userSchema), login);

router.post("/logout", logout);

export default router;
