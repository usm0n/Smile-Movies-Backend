import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedUser, DecodedUserRequest } from "../interfaces/users";
import { Message } from "../interfaces/messages";

const secretKey = process.env.JWT_SECRET || "";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided user" } as Message);
  }

  try {
    const decoded = jwt.verify(token, secretKey) as DecodedUser;

    if (!decoded.isVerified) {
      return res.json({ message: "User is not verified" } as Message);
    }

    (req as DecodedUserRequest).uid = decoded.uid;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" } as Message);
  }
};

export const verifyAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided admin" } as Message);
  }

  try {
    const decoded = jwt.verify(token, secretKey) as DecodedUser;
    if (!decoded.isAdmin) {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      } as Message);
    }
    (req as DecodedUserRequest).uid = decoded.uid;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" } as Message);
  }
};
