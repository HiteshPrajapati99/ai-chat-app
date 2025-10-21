import { config } from "../../config";
import { resHandler, asyncHandler } from "../../helpers";
import { errorMessages, successMessages } from "../../lang/messages";
import { generateToken } from "../../services/jwt";
import userService from "../user/services";
import { User } from "./schema";
import bcrypt from "bcrypt";

const cookieOptions = {
  // domain: config.FRONT_END_URL,
  secure: config.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "strict",
  httpOnly: config.NODE_ENV === "production",
} as const;

class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { username, password }: User = req.body;

    const isUser = await userService.getUser({ username });

    if (isUser)
      return resHandler.error(res, {
        errorType: "badRequest",
        m: errorMessages.invalidCred,
      });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userService.create({ username, password: hashPassword });

    const token = generateToken({ username, id: user.id });

    res.cookie(config.COOKIE_NAME, token, cookieOptions);

    resHandler.success(res, {
      m: "User registration success.",
    });
  });

  static login = asyncHandler(async (req, res) => {
    const { username, password }: User = req.body;

    const user = await userService.getUser({ username });

    if (user === null || !bcrypt.compareSync(password, user?.password || "")) {
      return resHandler.error(res, {
        errorType: "badRequest",
        m: errorMessages.invalidCred,
      });
    }

    const token = generateToken({ username: user.username, id: user.id });

    res.cookie(config.COOKIE_NAME, token, cookieOptions);

    resHandler.success(res, { m: successMessages.login, r: { token } });
  });

  static logout = asyncHandler(async (req, res) => {
    res.clearCookie(config.COOKIE_NAME);
    resHandler.success(res);
  });
}

export default AuthController;
