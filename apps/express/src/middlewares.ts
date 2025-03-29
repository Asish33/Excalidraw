import { Response, Request, NextFunction } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";
export interface CustomReq extends Request {
  email?: string;
}

export function middleware(
  req: CustomReq,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (decoded.email) {
    //db logic
    req.email = decoded.email;
    next();
    return;
  } else {
    res.status(403).json({
      message: "unauthorized",
    });
    return;
  }
}
