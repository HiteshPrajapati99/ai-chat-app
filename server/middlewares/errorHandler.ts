import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  const resBody = {
    s: 0,
    m: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  };

  return res.json(resBody);
};
