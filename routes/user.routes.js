import { Router } from "express";
import {
  addMovieToFavourites,
  addMovieToWatchLater,
  cancelPremium,
  deleteAllUsers,
  deleteUserByEmail,
  deleteUserById,
  deleteVerifyTokenByUserId,
  getAllUsers,
  getFavourites,
  getUserByEmail,
  getUserById,
  getWatchLater,
  givePremium,
  isInFavourites,
  isInWatchLater,
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
router.get("/:userId/isInFavourites/:movieId", isInFavourites);
router.post("/:userId/amtf/:movieId", addMovieToFavourites);
router.delete("/:userId/rmff/:favMovieId", removeMovieFromFavourites);

router.get("/:userId/watchlater", getWatchLater);
router.get("/:userId/isInWatchLater/:movieId", isInWatchLater);
router.post("/:userId/wlm/:movieId", addMovieToWatchLater);
router.delete("/:userId/rmwl/:wlmId", removeMovieFromWatchLater);

router.post("/givepremium/:email", givePremium);
router.post("/cancelpremium/:email", cancelPremium);

export default router;
