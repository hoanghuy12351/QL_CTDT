import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";

export type JwtPayload = {
  userId: number;
  email: string;
  role: string;
};

export const signAccessToken = (payload: JwtPayload) => {
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret as Secret) as JwtPayload;
};
