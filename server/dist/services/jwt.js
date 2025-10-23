"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const generateToken = (data) => {
    return jsonwebtoken_1.default.sign(data, config_1.config.jwtSecret, {
        algorithm: "HS256",
        expiresIn: "24h",
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret, { algorithms: ["HS256"] });
};
exports.verifyToken = verifyToken;
