import { type Express } from "express";
import MiddlewaresLoader from "./middlewares";
import RoutesLoader from "./routes";

class Loaders {
  /**
   * @static
   * @memberOf Loaders
   * @description Initialize application essential middlewares.
   * @param {Object} app contains express app and express object
   * @return
   */

  static init(app: Express) {
    // loading middleware
    MiddlewaresLoader.init(app);

    // app routers
    RoutesLoader.init(app);
  }
}

export default Loaders;
