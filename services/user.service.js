import Token from "../schemas/token.schema.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import Movie from "../schemas/movie.schema.js";
import Datastore from "nedb";
import { movies } from "./movie.service.js";

const users = new Datastore({ filename: "./data/users.json" });
users.loadDatabase((err) => console.log(err));

const tokens = new Datastore({ filename: "./data/tokens.json" });
tokens.loadDatabase((err) => console.log(err));
//get user by properties
export const getAllUsers = async (req, res) => {
  try {
    users.find({}, (err, users) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (!users.length) {
        res.status(404).json({
          message: "Users not found",
        });
      } else {
        res.status(200).json(users);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    users.find({ _id: req.params.id }, (err, user) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res.status(200).json(user);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const getUserByEmail = async (req, res) => {
  try {
    users.find({ email: req.params.email }, (err, user) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res.status(200).json(user);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// update user by properties
export const updateUserById = async (req, res) => {
  try {
    users.update({ _id: req.params.id }, req.body, (err, user) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res
          .status(200)
          .json({ message: "User updated successfully", user: user });
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
export const updateUserByEmail = async (req, res) => {
  try {
    users.update({ email: req.params.email }, req.body, (err, user) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res
          .status(200)
          .json({ message: "User updated successfully", user: user });
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// delete user by properties
export const deleteUserById = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const deleteUserByEmail = async (req, res) => {
  try {
    users.remove({ _id: req.params.id }, (err, user) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        res
          .status(200)
          .json({ message: "User deleted successfully", user: user });
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const deleteAllUsers = async (req, res) => {
  try {
    users.remove({}, (err, user) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (!user) {
        res.status(404).json({
          message: "Users not found",
        });
      } else {
        res.status(200).json(user);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// login && register user
export const registerUser = async (req, res) => {
  try {
    const userSchema = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      isPremiumUser: false,
      isAdmin: false,
      watchlater: [],
      favourites: [],
      isVerified: false,
      isBanned: false,
      isBlocked: false,
      notifications: true,
      createdAt: `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      lastLogin: `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
    };
    users.findOne({ email: req.params.email }, (err, user) => {
      if (err) {
        return res.json(err);
      } else if (user) {
        return res.json("User already exists");
      } else {
        users.insert(userSchema, (err, newUser) => {
          tokens.insert(
            {
              userId: newUser._id,
              token: crypto.randomBytes(3).toString("hex").toUpperCase(),
            },
            (err, token) => {
              sendMail(
                newUser.email,
                "Please Verify your account",
                `Your verification code is ${token.token}`
              );
            }
          );
          if (err) {
            return res.json(err);
          } else {
            res.json(newUser);
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
    } else {
      users.findOne({ email: email, password: password }, (err, user) => {
        if (!user) {
          res.status(401).json({ message: "Invalid email or password" });
        } else {
          if (user.isVerified == false) {
            tokens.findOne({ userId: user._id }, (err, token) => {
              if (!token) {
                tokens.insert(
                  {
                    userId: user._id,
                    token: crypto.randomBytes(3).toString("hex").toUpperCase(),
                  },
                  (err, token) => {
                    sendMail(
                      user.email,
                      "Please Verify your account",
                      `Your verification code is ${token.token}`
                    );
                    res.status(200).json({
                      message:
                        "Code send to your email, please verify your account",
                      user: user,
                    });
                  }
                );
              } else {
                res.status(200).json({
                  message: `Code already sent to your email at ${token.createdAt}, please verify your accaunt`,
                  user: user,
                });
              }
            });
          } else {
            res.status(200).json({ message: "Login successful", user: user });
          }
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// verify user
export const verifyUser = async (req, res) => {
  try {
    users.findOne({ _id: req.params.id }, (err, user) => {
      if (!user) {
        res.status(400).json({ message: "user invalid" });
      } else {
        if (user.isVerified) {
          res.status(400).json({ message: "User already verified" });
        } else {
          tokens.findOne(
            {
              userId: req.params.id,
              token: req.params.token,
            },
            (err, token) => {
              if (!token) {
                return res.status(400).json({ message: "invalid code" });
              } else {
                users.update({ _id: req.params.id }, { isVerified: true });
                tokens.remove({ userId: user._id });
                res.status(200).json({ message: "User verified successfully" });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// delete token by userID
export const deleteVerifyTokenByUserId = async (req, res) => {
  try {
    tokens.remove({ userId: req.params.id }, (err, token) => {
      if (!token) {
        res.status(404).json({ message: "Token not found" });
      } else {
        res.status(200).json({ message: "Token deleted successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// resend token
export const resendToken = async (req, res) => {
  try {
    const id = req.params.id;
    users.findOne({ _id: id }, (err, user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        if (user.isVerified) {
          res.status(400).json({ message: "User already verified" });
        } else {
          tokens.findOne({ userId: id }, (err, isTokenExist) => {
            if (isTokenExist) {
              tokens.findOne({ userId: id });
            }
            tokens.findOne(
              {
                userId: user._id,
                token: crypto.randomBytes(3).toString("hex").toUpperCase(),
              },
              (err, token) => {
                sendMail(
                  user.email,
                  "Please Verify your account",
                  `Your verification code is ${token.token}`
                );
              }
            );
          });
          res.status(200).json({
            message: `Code resent to your email. Please confirm code!`,
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add to favorites or watch later

export const getFavourites = async (req, res) => {
  try {
    const userId = req.params.userId;
    users.findOne({ _id: userId }, (err, user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        movies.find({ _id: { $in: user.favourites } }, (err, movies) => {
          if (!movies) {
            res.status(404).json({
              message: "Movies not found",
            });
          } else {
            res.status(200).json({
              movies: movies,
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMovieToFavourites = async (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    users.findOne({ _id: userId }, (err, user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        if (user.favourites.includes(movieId)) {
          res.status(400).json({
            message: "Movie already in favourites",
          });
        } else {
          users.update({ _id: userId }, { $push: { favourites: movieId } });
          res.status(200).json({
            message: "Movie added to favourites",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeMovieFromFavourites = (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    users.findOne({ _id: userId }, (err, user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        if (!user.favourites.includes(movieId)) {
          res.status(400).json({
            message: "Movie not in favourites",
          });
        } else {
          users.update({ _id: userId }, { $pull: { favourites: movieId } });
          res.status(200).json({
            message: "Movie removed from favourites",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWatchLater = async (req, res) => {
  try {
    const userId = req.params.userId;
    users.findOne({ _id: userId }, (err, user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        movies.find({ _id: { $in: user.watchLater } }, (err, movies) => {
          if (!movies) {
            res.status(404).json({
              message: "Movies not found",
            });
          } else {
            res.status(200).json({
              movies: movies,
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMovieToWatchLater = async (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    users.findOne({ _id: userId }, (err, user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        if (user.watchLater.includes(movieId)) {
          res.status(400).json({
            message: "Movie already in watch later",
          });
        } else {
          users.update({ _id: userId }, { $push: { watchLater: movieId } });
          res.status(200).json({
            message: "Movie added to watch later",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeMovieFromWatchLater = (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    users.findOne({ _id: userId }, (err, user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      } else {
        if (!user.watchLater.includes(movieId)) {
          res.status(400).json({
            message: "Movie not in watch later",
          });
        } else {
          users.update({ _id: userId }, { $pull: { watchLater: movieId } });
          res.status(200).json({
            message: "Movie removed from watch later",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
