import { Response, Request, NextFunction } from "express";
import { prismaClient } from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export interface CustomReq extends Request {
  id?: string;
}

export async function middleware(
  req: CustomReq,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers["Authorization"];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (!decoded.id) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const user = await prismaClient.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  req.id = user.id;
  next();
}
