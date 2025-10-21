import { type Express } from "express";
import authRouter from "../modules/auth/routes";
import chatRouter from "../modules/chat/routes";
import userRouter from "../modules/user/routes";
import { authMiddleware } from "../middlewares/authMiddleware";

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
  static init(app: Express) {
    console.info("Loading application routes");

    app.use("/api", authRouter);
    app.use("/api/user", authMiddleware, userRouter);
    app.use("/api/chat", authMiddleware, chatRouter);
  }
}

export default RoutesLoader;
