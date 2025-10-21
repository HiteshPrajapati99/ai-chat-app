import { config } from "../config";
import { resHandler, TryCatch } from "../helpers";
import { verifyToken } from "../services/jwt";

export const authMiddleware = TryCatch(async (req, res, next) => {
  const token =
    req.headers[config.COOKIE_NAME] || req.cookies[config.COOKIE_NAME];

  if (token === undefined || token === null)
    return resHandler.error(res, { errorType: "unAuthorized" });

  const data = verifyToken<{ email: string; id: number }>(token);

  if (data === null)
    return resHandler.error(res, { errorType: "unAuthorized" });

  const user = {
    ...data,
  };

  req.user = user;

  next();
});
