import { Router } from "express";
import {
  createMovie,
  deleteAllMovies,
  deleteComment,
  deleteMovieById,
  getAllMovies,
  getMovieById,
  postComment,
  updateMovieById,
} from "../services/movie.service.js";

const router = Router();

router.get("/", getAllMovies);
router.get("/id/:id", getMovieById);

router.put("/id/:id", updateMovieById);

router.delete("/id/:id", deleteMovieById);
router.delete("/", deleteAllMovies);

router.post("/", createMovie);

router.post("/:movieId/commentAs/:userId", postComment);
router.delete("/:movieId/deleteComment/:commentId", deleteComment);

export default router;
