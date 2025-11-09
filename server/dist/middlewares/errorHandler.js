"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    const resBody = {
        s: 0,
        m: err.message,
        stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    };
    return res.json(resBody);
};
exports.errorHandler = errorHandler;
