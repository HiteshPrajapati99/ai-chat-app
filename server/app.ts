// load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { config } from "./config";
import http from "node:http";
import SocketService from "./services/socket-services";
import { errorHandler } from "./middlewares/errorHandler";
import Loaders from "./loaders";

const { PORT } = config;

const app = express();
const server = http.createServer(app);

// use socket services
new SocketService(server);

Loaders.init(app);

// centralize error handler
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
