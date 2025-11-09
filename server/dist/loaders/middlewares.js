"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("../config");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
/**
 * @description It plays an essential and key role to add middlewares. All request passes
 *              through the middleware.
 */
class MiddlewaresLoader {
    /**
     * @static
     * @description Initializing middleware contains eg security, logger, parsing, request, viewing.
     * @memberOf Middlewares
     * @param {Object} app express object
     * @return
     */
    static init(app) {
        console.info("Loading application middlewares");
        app.use((0, cors_1.default)({
            origin: [config_1.config.FRONT_END_URL],
            credentials: true,
        }));
        // security middlewares
        app.use((0, helmet_1.default)({
            crossOriginResourcePolicy: false,
        }));
        app.use((0, compression_1.default)());
        // http request middlewares
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({
            extended: false,
            limit: "50mb",
            parameterLimit: 50000,
        }));
        app.use((0, cookie_parser_1.default)());
    }
}
exports.default = MiddlewaresLoader;
