"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// load environment variables
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const node_http_1 = __importDefault(require("node:http"));
const socket_services_1 = __importDefault(require("./services/socket-services"));
const errorHandler_1 = require("./middlewares/errorHandler");
const loaders_1 = __importDefault(require("./loaders"));
const { PORT } = config_1.config;
const app = (0, express_1.default)();
const server = node_http_1.default.createServer(app);
// use socket services
new socket_services_1.default(server);
loaders_1.default.init(app);
// centralize error handler
app.use(errorHandler_1.errorHandler);
// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
