import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import userController from "./controller";

const { getAllUsers, getUser } = userController;

const router = Router();

router.get("/", authMiddleware, getUser);

router.get("/get-all", authMiddleware, getAllUsers);

export default router;
