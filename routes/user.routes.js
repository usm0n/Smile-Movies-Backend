import { Router } from "express";
import {
  addMovieToFavourites,
  addMovieToWatchLater,
  deleteUserByEmail,
  deleteUserById,
  deleteVerifyTokenByUserId,
  getAllUsers,
  getUserByEmail,
  getUserById,
  loginUser,
  registerUser,
  removeMovieFromFavourites,
  removeMovieFromWatchLater,
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

router.post("/:userId/amtf/:movieId", addMovieToFavourites);
router.delete("/:userId/rmff/:favMovieId", removeMovieFromFavourites)

router.post("/:userId/wlm/:movieId", addMovieToWatchLater);
router.delete("/:userId/rmwl/:wlmId", removeMovieFromWatchLater)

export default router;
