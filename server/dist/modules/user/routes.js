"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const controller_1 = __importDefault(require("./controller"));
const { getAllUsers, getUser } = controller_1.default;
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authMiddleware, getUser);
router.get("/get-all", authMiddleware_1.authMiddleware, getAllUsers);
exports.default = router;
