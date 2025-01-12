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
