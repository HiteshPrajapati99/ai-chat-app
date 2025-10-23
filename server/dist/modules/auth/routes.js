"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateReq_1 = __importDefault(require("../../middlewares/validateReq"));
const controller_1 = __importDefault(require("./controller"));
const schema_1 = require("./schema");
const { register, login, logout } = controller_1.default;
const router = (0, express_1.Router)();
router.post("/register", (0, validateReq_1.default)(schema_1.userSchema), register);
router.post("/login", (0, validateReq_1.default)(schema_1.userSchema), login);
router.post("/logout", logout);
exports.default = router;
