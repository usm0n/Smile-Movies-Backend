import {
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
} from "../middlewares/verifyTokenMiddleware";
import { Message } from "../interfaces/messages";
import { DecodedUserRequest, User } from "../interfaces/users";

const usersCollection = collection(db, "users");

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