"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("../modules/auth/routes"));
const routes_2 = __importDefault(require("../modules/chat/routes"));
const routes_3 = __importDefault(require("../modules/user/routes"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
/**
 * @description Define all app routes
 */
class RoutesLoader {
    /**
     * @static
     * @memberof Routes
     * @description initialize app routes
     * @param {Object} app express object
     * @return
     */
    static init(app) {
        console.info("Loading application routes");
        app.use("/api", routes_1.default);
        app.use("/api/user", authMiddleware_1.authMiddleware, routes_3.default);
        app.use("/api/chat", authMiddleware_1.authMiddleware, routes_2.default);
    }
}
exports.default = RoutesLoader;
