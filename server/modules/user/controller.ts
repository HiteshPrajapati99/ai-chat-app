import userService from "./services";
import { resHandler, asyncHandler } from "../../helpers";
import { UserUpdate } from "./schema";
import { errorMessages, successMessages } from "../../lang/messages";

class UserController {
  static getUser = asyncHandler(async (req, res) => {
    const user_id = Number(req.query.user_id);

    const id = req.user.id;

    if (!id) return resHandler.error(res);

    const user = await userService.getUser({ id: user_id ? user_id : id });

    return resHandler.success(res, { r: user });
  });

  static getAllUsers = asyncHandler(async (req, res) => {
    const id = req.user.id;

    const users = await userService.getAllUsers(id);

    resHandler.success(res, { r: users });
  });
}

export default UserController;
