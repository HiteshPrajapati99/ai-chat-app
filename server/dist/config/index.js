"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const _config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 5000,
    COOKIE_NAME: process.env.AUTH_COOKIE,
    jwtSecret: process.env.JWT_SECRET || "",
    FRONT_END_URL: process.env.FRONT_END_URL,
    BACK_END_URL: process.env.BACK_END_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_AUTH_SCOPE: process.env.GOOGLE_AUTH_SCOPE,
    NAME: process.env.NAME,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
exports.config = Object.freeze(_config);
