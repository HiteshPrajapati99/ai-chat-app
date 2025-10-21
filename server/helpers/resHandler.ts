import { NextFunction, Response } from "express";
import { resData as d } from "../utils";

const success = (
  res: Response,
  data?: { m?: string; r?: unknown; c?: number }
) => {
  return res.status(d.statusCode.success).json({
    s: 1,
    m: data?.m || d.handler.m.success,
    r: data?.r || null,
    ...(data?.c && { c: data.c }),
  });
};

const error = (
  res: Response,
  data?: { m?: string; errorType?: keyof typeof d.messages }
) => {
  const { errorType = "badRequest" } = data ?? {};

  const sCode =
    d.statusCode[errorType] !== undefined
      ? d.statusCode[errorType]
      : d.statusCode.badRequest;

  return res.status(sCode).json({
    s: 0,
    m: data?.m
      ? data.m
      : d.handler.m[errorType] !== undefined
      ? d.handler.m[errorType]
      : d.handler.m.badRequest,
    errorType: d.messages[errorType],
  });
};

const serverError = (res: Response, data: { error: any }) => {
  return res.status(d.statusCode.serverError).json({
    s: 0,
    m: data.error.message || d.messages.serverError,
    errorName: d.messages.serverError,
  });
};

export const resHandler = {
  success,
  error,
  serverError,
};
