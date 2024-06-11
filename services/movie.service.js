import Datastore from "nedb";

export const movies = new Datastore({ filename: "./data/movies.json" });
movies.loadDatabase((err) => console.log(err));

export const getAllMovies = (req, res) => {
  try {
    movies.find({}, (err, movies) => {
      if (!movies) {
        res.status(404).json({
          message: "Movies not found",
        });
      } else {
        res.status(200).json(movies);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovieById = (req, res) => {
  try {
    const id = req.params.id;
    movies.findOne({ _id: id }, (err, movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(200).json(movie);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMovieById = (req, res) => {
  try {
    const id = req.params.id;
    const movie = req.body;
    movies.update({ _id: id }, { $set: movie }, (err, movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(200).json(movie);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMovieById = (req, res) => {
  try {
    const id = req.params.id;
    movies.remove({ _id: id }, (err, movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(200).json(movie);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllMovies = (req, res) => {
  try {
    movies.remove({}, (err, movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movies not found",
        });
      } else {
        res.status(200).json({ message: "All Movies are deleted" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMovie = (req, res) => {
  try {
    const movie = {
      title: {
        uz: req.body.title.uz,
        ru: req.body.title.ru,
        en: req.body.title.en,
      },
      notes: {
        uz: req.body.notes.uz,
        ru: req.body.notes.ru,
        en: req.body.notes.en,
      },
      description: {
        uz: req.body.description.uz,
        ru: req.body.description.ru,
        en: req.body.description.en,
      },
      releaseDate: {
        day: req.body.releaseDate.day,
        month: req.body.releaseDate.month,
        year: req.body.releaseDate.year,
      },
      duration: {
        hour: req.body.duration.hour,
        min: req.body.duration.min,
      },
      rating: {
        like: req.body.rating.like,
        dislike: req.body.rating.dislike,
        imdb: req.body.rating.imdb,
      },
      country: {
        uz: req.body.country.uz,
        ru: req.body.country.ru,
        en: req.body.country.en,
      },
      credit: {
        uz: req.body.credit.uz,
        ru: req.body.credit.ru,
        en: req.body.credit.en,
      },
      image: {
        portrait: req.body.image.portrait,
        fullscreen: req.body.image.fullscreen,
      },
      status: {
        isNew: req.body.status.isNew,
        isTrending: req.body.status.isTrending,
        type: req.body.status.type,
        isAvailable: req.body.status.isAvailable,
      },
      movie: {
        uz: req.body.movie.uz,
        ru: req.body.movie.ru,
        en: req.body.movie.en,
      },
      trailer: req.body.trailer,
      comments: [],
    };
    movies.insert(movie, (err, movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(201).json(movie);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByMovieId = (req, res) => {
  try {
    const id = req.params.movieId;
    movies.findOne({ _id: id }, (err, movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(200).json(movie.comments);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentById = (req, res) => {
  try {
    const movieId = req.params.movieId;
    const commentId = req.params.commentId;
    movies.findOne({ _id: movieId }, (err, movie) => {
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        res.status(200).json(movie.comments[commentId]);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postComment = (req, res) => {
  try {
    const movieId = req.params.movieId;
    const comment = req.body;
    movies.update(
      { _id: movieId },
      { $push: { comments: comment } },
      (err, movie) => {
        if (!movie) {
          res.status(404).json({
            message: "Movie not found",
          });
        } else {
          res.status(200).json(movie);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = (req, res) => {
  try {
    const movieId = req.params.movieId;
    const commentId = req.params.commentId;
    movies.update(
      { _id: movieId },
      { $pull: { comments: { _id: commentId } } },
      (err, movie) => {
        if (!movie) {
          res.status(404).json({
            message: "Movie not found",
          });
        } else {
          res.status(200).json(movie);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = (req, res) => {
  try {
    const movieId = req.params.movieId;
    const commentId = req.params.commentId;
    const comment = req.body;
    movies.update(
      { _id: movieId, "comments._id": commentId },
      { $set: { "comments.$": comment } },
      (err, movie) => {
        if (!movie) {
          res.status(404).json({
            message: "Movie not found",
          });
        } else {
          res.status(200).json(movie);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
