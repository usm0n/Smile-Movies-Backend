import mongoose from "mongoose";
import Movie from "../schemas/movie.schema.js";
import User from "../schemas/user.schema.js";

export const getAllMovies = async (req, res) => {
  try {
    await Movie.find().then((movies) => {
      if (!movies || movies.length === 0) {
        res.status(404).json({
          message: "Movies not found",
        });
      } else {
        res.status(200).json(movies);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const getMovieById = async (req, res) => {
  try {
    await Movie.findById(req.params.id).then((movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(200).json(movie);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateMovieById = async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.params.id, req.body).then((movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(200).json(movie);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteMovieById = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id).then((movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(200).json(movie);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const deleteAllMovies = async (req, res) => {
  try {
    const movies = Movie.find({});
    await Movie.deleteMany().then(() => {
      if (!movies || !movies.length) {
        res.status(404).json({
          message: "Movies not found",
        });
      } else {
        res.status(200).json({ message: "All Movies are deleted" });
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const createMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save().then((movie) => {
      res.status(201).json(movie);
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getCommentById = async (req, res) => {
  const movieId = req.params.movieId
  const commentId = req.params.commentId;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      res.status(404).json({
        message: "Movie not found",
      });
    } else{
      const comment = movie.comments.find((comment) => comment._id == commentId);
      if (!comment) {
        res.status(404).json({
          message: "Comment not found",
        });
      } else {
        res.status(200).json(comment);
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export const getCommentsByMovieId = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      res.status(404).json({
        message: "Movie not found",
      });
    } else if (!movie.comments.length) {
      res.status(404).json({
        message: "Comments not found",
      });
    } else {
      res.status(200).json(movie.comments);
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const postComment = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const comment = {
        _id: new mongoose.Types.ObjectId(),
        userId: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        comment: req.body.comment,
        like: 0,
        dislike: 0,
      };
      const movie = await Movie.findById(movieId);
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else if (!comment.comment.trim() || !comment.comment) {
        res.status(404).json({
          message: "Comment cannot be empty",
        });
      } else {
        movie.comments.push(comment);
        await movie.save();
        res.status(201).json(movie);
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const commentId = req.params.commentId;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      res.status(404).json({
        message: "Movie not found",
      });
    } else {
      movie.comments = movie.comments.filter(
        (comment) => comment._id != commentId
      );
      await movie.save();
      res.status(201).json(movie);
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
