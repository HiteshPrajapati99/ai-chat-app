"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resHandler = void 0;
const utils_1 = require("../utils");
const success = (res, data) => {
    return res.status(utils_1.resData.statusCode.success).json(Object.assign({ s: 1, m: (data === null || data === void 0 ? void 0 : data.m) || utils_1.resData.handler.m.success, r: (data === null || data === void 0 ? void 0 : data.r) || null }, ((data === null || data === void 0 ? void 0 : data.c) && { c: data.c })));
};
const error = (res, data) => {
    const { errorType = "badRequest" } = data !== null && data !== void 0 ? data : {};
    const sCode = utils_1.resData.statusCode[errorType] !== undefined
        ? utils_1.resData.statusCode[errorType]
        : utils_1.resData.statusCode.badRequest;
    return res.status(sCode).json({
        s: 0,
        m: (data === null || data === void 0 ? void 0 : data.m)
            ? data.m
            : utils_1.resData.handler.m[errorType] !== undefined
                ? utils_1.resData.handler.m[errorType]
                : utils_1.resData.handler.m.badRequest,
        errorType: utils_1.resData.messages[errorType],
    });
};
const serverError = (res, data) => {
    return res.status(utils_1.resData.statusCode.serverError).json({
        s: 0,
        m: data.error.message || utils_1.resData.messages.serverError,
        errorName: utils_1.resData.messages.serverError,
    });
};
exports.resHandler = {
    success,
    error,
    serverError,
};
