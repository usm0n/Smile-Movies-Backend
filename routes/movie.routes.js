import { Router } from "express";
import {
  createMovie,
  deleteAllMovies,
  deleteComment,
  deleteMovieById,
  getAllMovies,
  getCommentById,
  getCommentsByMovieId,
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

router.get("/:movieId/comments", getCommentsByMovieId)
router.get("/:movieId/comments/:commentId", getCommentById)
router.post("/:movieId/postComment", postComment);
router.delete("/:movieId/deleteComment/:commentId", deleteComment);

export default router;
