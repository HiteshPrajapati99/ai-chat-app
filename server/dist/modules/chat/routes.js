"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateReq_1 = __importDefault(require("../../middlewares/validateReq"));
const controller_1 = __importDefault(require("./controller"));
const schema_1 = require("./schema");
const router = (0, express_1.Router)();
// Chat Management Routes
router.post("/", (0, validateReq_1.default)(schema_1.createChatSchema), controller_1.default.createChat);
router.get("/", controller_1.default.getChats);
router.get("/:chat_id", controller_1.default.getChatById);
// Chat Member Management
router.post("/:chat_id/invite", (0, validateReq_1.default)(schema_1.inviteUserSchema), controller_1.default.inviteUser);
router.delete("/:chat_id/users/:user_id", controller_1.default.removeUser);
// Message Routes
router.get("/:chat_id/messages", (0, validateReq_1.default)(schema_1.getMessagesSchema, "query"), controller_1.default.getMessages);
exports.default = router;
