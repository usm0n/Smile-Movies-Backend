import { Router } from "express";
import {
  addMovieToFavourites,
  addMovieToWatchLater,
  deleteAllTokens,
  deleteAllUsers,
  deleteUserByEmail,
  deleteUserById,
  deleteVerifyTokenByUserId,
  getAllTokens,
  getAllUsers,
  getFavourites,
  getUserByEmail,
  getUserById,
  getWatchLater,
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
router.delete("/", deleteAllUsers);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/:id/verify/:token", verifyUser);

router.delete("/deletetoken/:id", deleteVerifyTokenByUserId);
router.post("/resendtoken/:id", resendToken);

router.get("/:userId/favourites", getFavourites);
router.post("/:userId/amtf/:movieId", addMovieToFavourites);
router.delete("/:userId/rmff/:movieId", removeMovieFromFavourites);

router.get("/:userId/watchlater", getWatchLater);
router.post("/:userId/wlm/:movieId", addMovieToWatchLater);
router.delete("/:userId/rmwl/:wlmId", removeMovieFromWatchLater);

router.get("/tokens", getAllTokens);
router.delete("/tokens", deleteAllTokens);

export default router;
