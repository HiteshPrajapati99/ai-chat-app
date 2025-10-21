import { NextFunction, Request, Response } from "express";
import { resHandler } from "./resHandler";

type Req = Request & {
  user: {
    username: string;
    id: number;
  };
};

type HandleType = (req: Req, res: Response, next: NextFunction) => void;

export const asyncHandler =
  (func: HandleType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = func(req as Req, res, next);

      // Check if the result is a promise, if so, handle errors
      // @ts-ignore
      if (result instanceof Promise) {
        return result.catch((error: Error) =>
          resHandler.serverError(res, { error })
        );
      }
      return result;
    } catch (error) {
      console.error(error);
      return resHandler.serverError(res, { error });
    }
  };
