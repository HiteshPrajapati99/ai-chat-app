import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "../config";
import compression from "compression";
import cookieParser from "cookie-parser";

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

  static init(app: Express) {
    console.info("Loading application middlewares");
    app.use(
      cors({
        origin: [config.FRONT_END_URL],
        credentials: true,
      })
    );
    // security middlewares
    app.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    );
    app.use(compression());

    // http request middlewares
    app.use(express.json());

    app.use(
      express.urlencoded({
        extended: false,
        limit: "50mb",
        parameterLimit: 50000,
      })
    );

    app.use(cookieParser());
  }
}

export default MiddlewaresLoader;
