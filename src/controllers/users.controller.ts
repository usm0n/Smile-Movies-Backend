import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config";
import { Request, Response } from "express";
import {
  verifyAdminToken,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import { Message } from "../interfaces/messages";
import {
  DecodedUser,
  DecodedUserRequest,
  User,
  UserVerifyToken,
} from "../interfaces/users";
import bcrypt from "bcrypt";
import { getFormattedDateAndTime } from "../utils/defaults";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail";

const usersCollection = collection(db, "users");
const tokensCollection = collection(db, "verifyTokens");
const resetTokensCollection = collection(db, "resetTokens");

export const getAllUsers = [
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const usersQuery = query(usersCollection, orderBy("createdAt", "desc"));
      const usersDocs = await getDocs(usersQuery);

      if (usersDocs.empty) {
        res.status(404).json({ message: "No users found" } as Message);
      } else {
        const users = usersDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.status(200).json(users as User[]);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const getUserById = [
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.params.id;
      const user = await getDoc(doc(usersCollection, uid));
      if (!user.exists()) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        res.status(200).json({ id: user.id, ...user.data() } as User);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const getUserByEmail = [
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      const usersQuery = query(usersCollection, where("email", "==", email));
      const usersDocs = await getDocs(usersQuery);
      if (usersDocs.empty) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        const user = usersDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))[0];
        res.status(200).json(user as User);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const getMyself = [
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as DecodedUserRequest).uid;
      const user = await getDoc(doc(usersCollection, uid));
      if (!user.exists()) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        res.status(200).json({ id: user.id, ...user.data() } as User);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const updateUserById = [
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.params.id;
      const userDoc = doc(usersCollection, uid);
      const user = await getDoc(userDoc);
      if (!user.exists()) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        await updateDoc(userDoc, req.body);
        res.status(200).json({ id: user.id, ...req.body } as User);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const updateUserByEmail = [
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      const usersQuery = query(usersCollection, where("email", "==", email));
      const usersDocs = await getDocs(usersQuery);
      if (usersDocs.empty) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        const user = usersDocs.docs[0];
        await updateDoc(user.ref, req.body);
        res.status(200).json({ id: user.id, ...req.body } as User);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const updateMyself = [
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as DecodedUserRequest).uid;
      const userDoc = doc(usersCollection, uid);
      const user = await getDoc(userDoc);
      if (!user.exists()) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        await updateDoc(userDoc, req.body);
        res.status(200).json({ id: user.id, ...req.body } as User);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const deleteUserById = [
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const uid = req.params.id;
      const userDoc = doc(usersCollection, uid);
      const user = await getDoc(userDoc);
      if (!user.exists()) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        await deleteDoc(userDoc);
        res.status(200).json({ message: "User deleted" } as Message);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const deleteUserByEmail = [
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      const usersQuery = query(usersCollection, where("email", "==", email));
      const usersDocs = await getDocs(usersQuery);
      if (usersDocs.empty) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        const user = usersDocs.docs[0];
        await deleteDoc(user.ref);
        res.status(200).json({ message: "User deleted" } as Message);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const deleteMyself = [
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as DecodedUserRequest).uid;
      const userDoc = doc(usersCollection, uid);
      const user = await getDoc(userDoc);
      if (!user.exists()) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        await deleteDoc(userDoc);
        res.status(200).json({ message: "User deleted" } as Message);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body as User;
    const user = await getDocs(
      query(usersCollection, where("email", "==", req.body.email))
    );
    if (!user.empty) {
      res.status(409).json({ message: "User already exists" } as Message);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await addDoc(usersCollection, {
        firstname,
        lastname: lastname || "",
        email,
        password: hashedPassword,
        createdAt: getFormattedDateAndTime(),
        isAdmin: false,
        isBanned: false,
        isVerified: false,
      } as User);

      const newVerifyToken = {
        uid: newUser.id,
        token: crypto.randomBytes(3).toString("hex").toUpperCase(),
      } as UserVerifyToken;
      const jwtToken = jwt.sign(
        { uid: newUser.id, isAdmin: false, isVerified: false } as DecodedUser,
        process.env.JWT_SECRET as string
      );

      await addDoc(tokensCollection, newVerifyToken);
      await sendMail(
        email,
        "Verify your email",
        `Your verification token: ${newVerifyToken.token}`
      );

      res.status(201).json({ token: jwtToken });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" } as Message);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as User;
    const user = await getDocs(
      query(usersCollection, where("email", "==", email))
    );
    if (user.empty) {
      res.status(404).json({ message: "User not found" } as Message);
    } else {
      const userData = user.docs[0].data() as User;
      const isMatch = await bcrypt.compare(password, userData.password);
      if (isMatch) {
        const jwtToken = jwt.sign(
          {
            uid: user.docs[0].id,
            isAdmin: userData.isAdmin,
            isVerified: userData.isVerified,
          } as DecodedUser,
          process.env.JWT_SECRET as string
        );
        res.status(200).json({ token: jwtToken });
      } else {
        res.status(401).json({ message: "Invalid credentials" } as Message);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" } as Message);
  }
};

export const verifyUser = [
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as DecodedUserRequest).uid;
      const user = await getDoc(doc(usersCollection, uid));
      const isVerified = (user.data() as User).isVerified;
      if (!user.exists()) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        if (isVerified) {
          return res
            .status(400)
            .json({ message: "User already verified" } as Message);
        }
        const tokenQuery = query(
          tokensCollection,
          where("uid", "==", uid),
          where("token", "==", req.params.token)
        );
        const tokenDocs = await getDocs(tokenQuery);

        if (tokenDocs.empty) {
          return res
            .status(404)
            .json({ message: "Token not found" } as Message);
        }

        await updateDoc(doc(usersCollection, uid), { isVerified: true });
        await deleteDoc(tokenDocs.docs[0].ref);
        res.status(200).json({ message: "User verified" } as Message);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const resendVerificationToken = [
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const uid = (req as DecodedUserRequest).uid;
      const user = await getDoc(doc(usersCollection, uid));
      if (!user.exists()) {
        res.status(404).json({ message: "User not found" } as Message);
      } else {
        const isVerified = (user.data() as User).isVerified;
        if (isVerified) {
          return res
            .status(400)
            .json({ message: "User already verified" } as Message);
        }
        const tokenQuery = query(tokensCollection, where("uid", "==", uid));
        const tokenDocs = await getDocs(tokenQuery);
        if (!tokenDocs.empty) {
          await deleteDoc(doc(tokensCollection, tokenDocs.docs[0].id));
        }
        const newToken = {
          uid,
          token: crypto.randomBytes(3).toString("hex").toUpperCase(),
        } as UserVerifyToken;
        await addDoc(tokensCollection, newToken);
        await sendMail(
          (user.data() as User).email,
          "Verify your email",
          `Your verification token: ${newToken.token}`
        );
        res.status(200).json({ message: "Verification token sent" } as Message);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" } as Message);
    }
  },
];

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user = await getDocs(
      query(usersCollection, where("email", "==", email))
    );
    if (user.empty) {
      res.status(404).json({ message: "User not found" } as Message);
    } else {
      const resetToken = {
        uid: user.docs[0].id,
        token: crypto.randomBytes(16).toString("hex").toUpperCase(),
      } as UserVerifyToken;
      await addDoc(resetTokensCollection, resetToken);
      const resetURL = `${process.env.CLIENT_URL}/reset-password/${email}/${resetToken.token}`;
      await sendMail(
        email,
        "Reset your password",
        `Reset your password by visiting this link: ${resetURL}`
      );
      res.status(200).json({ message: "Reset password link sent" } as Message);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" } as Message);
  }
};

export const resendForgotPasswordToken = async (
  req: Request,
  res: Response
) => {
  try {
    const email = req.body.email;
    const user = await getDocs(
      query(usersCollection, where("email", "==", email))
    );
    if (user.empty) {
      res.status(404).json({ message: "User not found" } as Message);
    } else {
      const tokenQuery = query(
        resetTokensCollection,
        where("uid", "==", user.docs[0].id)
      );
      const tokenDocs = await getDocs(tokenQuery);
      if (!tokenDocs.empty) {
        await deleteDoc(doc(resetTokensCollection, tokenDocs.docs[0].id));
      }
      const resetToken = {
        uid: user.docs[0].id,
        token: crypto.randomBytes(16).toString("hex").toUpperCase(),
      } as UserVerifyToken;
      await addDoc(resetTokensCollection, resetToken);
      const resetURL = `${process.env.CLIENT_URL}/reset-password/${email}/${resetToken.token}`;
      await sendMail(
        email,
        "Reset your password",
        `Reset your password by visiting this link: ${resetURL}`
      );
      res.status(200).json({ message: "Reset password link sent" } as Message);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" } as Message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await getDocs(
      query(usersCollection, where("email", "==", email))
    );
    if (user.empty) {
      res.status(404).json({ message: "User not found" } as Message);
    } else {
      const tokenQuery = query(
        resetTokensCollection,
        where("uid", "==", user.docs[0].id),
        where("token", "==", req.params.token)
      );
      const tokenDocs = await getDocs(tokenQuery);
      if (tokenDocs.empty) {
        res.status(404).json({ message: "Token not found" } as Message);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        await updateDoc(doc(usersCollection, user.docs[0].id), {
          password: hashedPassword,
        });
        await deleteDoc(doc(resetTokensCollection, tokenDocs.docs[0].id));
        res.status(200).json({ message: "Password reset" } as Message);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" } as Message);
  }
}