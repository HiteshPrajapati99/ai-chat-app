import { errorMessages, successMessages } from "../lang/messages";

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
    success: successMessages.success,
    badRequest: errorMessages.badRequest,
    serverError: errorMessages.serverError,
    validationError: errorMessages.validationError,
    recordNotFound: errorMessages.recordNotFound,
    unAuthorized: errorMessages.unAuthorized,
    missingField: errorMessages.missingField,
  },
};

export const resData = {
  handler,
  statusCode,
  messages,
};
