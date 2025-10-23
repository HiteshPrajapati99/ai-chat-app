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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const helpers_1 = require("../../helpers");
const messages_1 = require("../../lang/messages");
const jwt_1 = require("../../services/jwt");
const services_1 = __importDefault(require("../user/services"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cookieOptions = {
    // domain: config.FRONT_END_URL,
    secure: config_1.config.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "strict",
    httpOnly: config_1.config.NODE_ENV === "production",
};
class AuthController {
}
_a = AuthController;
AuthController.register = (0, helpers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const isUser = yield services_1.default.getUser({ username });
    if (isUser)
        return helpers_1.resHandler.error(res, {
            errorType: "badRequest",
            m: messages_1.errorMessages.invalidCred,
        });
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield services_1.default.create({ username, password: hashPassword });
    const token = (0, jwt_1.generateToken)({ username, id: user.id });
    res.cookie(config_1.config.COOKIE_NAME, token, cookieOptions);
    helpers_1.resHandler.success(res, {
        m: "User registration success.",
    });
}));
AuthController.login = (0, helpers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield services_1.default.getUser({ username });
    if (user === null || !bcrypt_1.default.compareSync(password, (user === null || user === void 0 ? void 0 : user.password) || "")) {
        return helpers_1.resHandler.error(res, {
            errorType: "badRequest",
            m: messages_1.errorMessages.invalidCred,
        });
    }
    const token = (0, jwt_1.generateToken)({ username: user.username, id: user.id });
    res.cookie(config_1.config.COOKIE_NAME, token, cookieOptions);
    helpers_1.resHandler.success(res, { m: messages_1.successMessages.login, r: { token } });
}));
AuthController.logout = (0, helpers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie(config_1.config.COOKIE_NAME);
    helpers_1.resHandler.success(res);
}));
exports.default = AuthController;
