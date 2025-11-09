"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const resHandler_1 = require("./resHandler");
const asyncHandler = (func) => (req, res, next) => {
    try {
        const result = func(req, res, next);
        // Check if the result is a promise, if so, handle errors
        // @ts-ignore
        if (result instanceof Promise) {
            return result.catch((error) => resHandler_1.resHandler.serverError(res, { error }));
        }
        return result;
    }
    catch (error) {
        console.error(error);
        return resHandler_1.resHandler.serverError(res, { error });
    }
};
exports.asyncHandler = asyncHandler;
