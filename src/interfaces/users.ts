import { Request } from "express";

export interface DecodedUser {
  uid: string;
  isAdmin: boolean;
  isVerified: boolean;
}

export interface DecodedUserRequest extends Request {
  uid: string;
  isAdmin: boolean;
  isVerified: boolean;
}

export interface User {
  id: string;
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
  createdAt: string;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
}
