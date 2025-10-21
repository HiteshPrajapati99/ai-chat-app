import JWT from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (data: Record<string, unknown>) => {
  return JWT.sign(data, config.jwtSecret, {
    algorithm: "HS256",
    expiresIn: "24h",
  });
};

export const verifyToken = <T>(token: string) => {
  return JWT.verify(token, config.jwtSecret, { algorithms: ["HS256"] }) as T;
};
