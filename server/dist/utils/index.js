"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resData = void 0;
const messages_1 = require("../lang/messages");
const statusCode = {
    success: 200,
    badRequest: 400,
    serverError: 500,
    unAuthorized: 401,
    validationError: 422,
    missingField: 417,
    recordNotFound: 404,
};
const messages = {
    success: "SUCCESS",
    serverError: "SERVER_ERROR",
    badRequest: "BAD_REQUEST",
    recordNotFound: "RECORD_NOT_FOUND",
    validationError: "VALIDATION_ERROR",
    unAuthorized: "UNAUTHORIZED",
    missingField: "MISSING_FIELD",
};
const handler = {
    s: {
        success: 1,
        error: 0,
    },
    m: {
        success: messages_1.successMessages.success,
        badRequest: messages_1.errorMessages.badRequest,
        serverError: messages_1.errorMessages.serverError,
        validationError: messages_1.errorMessages.validationError,
        recordNotFound: messages_1.errorMessages.recordNotFound,
        unAuthorized: messages_1.errorMessages.unAuthorized,
        missingField: messages_1.errorMessages.missingField,
    },
};
exports.resData = {
    handler,
    statusCode,
    messages,
};
