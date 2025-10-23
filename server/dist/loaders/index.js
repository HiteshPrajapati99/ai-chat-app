"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = __importDefault(require("./middlewares"));
const routes_1 = __importDefault(require("./routes"));
class Loaders {
    /**
     * @static
     * @memberOf Loaders
     * @description Initialize application essential middlewares.
     * @param {Object} app contains express app and express object
     * @return
     */
    static init(app) {
        // loading middleware
        middlewares_1.default.init(app);
        // app routers
        routes_1.default.init(app);
    }
}
exports.default = Loaders;
