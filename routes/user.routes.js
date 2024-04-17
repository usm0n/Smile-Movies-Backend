import { Router } from "express";
import {
  deleteUserByEmail,
  deleteUserById,
  deleteVerifyTokenByUserId,
  getAllUsers,
  getUserByEmail,
  getUserById,
  loginUser,
  registerUser,
  resendToken,
  updateUserByEmail,
  updateUserById,
  verifyUser,
} from "../services/user.service.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/id/:id", getUserById);
router.get("/email/:email", getUserByEmail);

router.put("/id/:id", updateUserById);
router.put("/email/:email", updateUserByEmail);

router.delete("/id/:id", deleteUserById);
router.delete("/email/:email", deleteUserByEmail);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/:id/verify/:token", verifyUser);

router.delete("/deletetoken/:id", deleteVerifyTokenByUserId);
router.post("/resendtoken/:id", resendToken);

export default router;