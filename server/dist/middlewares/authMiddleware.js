"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const config_1 = require("../config");
const helpers_1 = require("../helpers");
const jwt_1 = require("../services/jwt");
exports.authMiddleware = (0, helpers_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers[config_1.config.COOKIE_NAME] || req.cookies[config_1.config.COOKIE_NAME];
    if (token === undefined || token === null)
        return helpers_1.resHandler.error(res, { errorType: "unAuthorized" });
    const data = (0, jwt_1.verifyToken)(token);
    if (data === null)
        return helpers_1.resHandler.error(res, { errorType: "unAuthorized" });
    const user = Object.assign({}, data);
    req.user = user;
    next();
}));
