import * as z from "zod";
import { resHandler } from "../helpers";
import { NextFunction, Request, Response } from "express";

const validateReq = (
  schema: z.ZodSchema<any>,
  validateType: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[validateType];
      const result = schema.parse(data);
      req.body = result;
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const perty = z.prettifyError(error);
        return resHandler.error(res, {
          errorType: "validationError",
          m: perty,
        });
      }

      return resHandler.error(res, {
        errorType: "validationError",
      });
    }
  };
};

export default validateReq;
