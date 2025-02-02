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

export interface Watchlist {
  type: string;
  id: string;
}

export interface User {
  id: string;
  profilePic?: string;
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
  createdAt: string;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  watchlist: Watchlist[];
  favorites: Watchlist[];
}

export interface UserVerifyToken {
  uid: string;
  token: string;
}

export interface GoogleUserResponse {}
