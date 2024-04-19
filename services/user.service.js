import Token from "../schemas/token.schema.js";
import User from "../schemas/user.schema.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import Movie from "../schemas/movie.schema.js";
import mongoose from "mongoose";

//get user by properties
export const getAllUsers = async (req, res) => {
  try {
    await User.find({})
      .then((users) => {
        if (!users.length) {
          res.status(404).json({
            message: "Users not found",
          });
        } else {
          res.status(200).json(users);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    await User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "User not found",
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
export const getUserByEmail = async (req, res) => {
  try {
    await User.findOne({ email: req.params.email })
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "User not found",
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
// update user by properties
export const updateUserById = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "User not found",
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
export const updateUserByEmail = async (req, res) => {
  try {
    await User.findOneAndUpdate({ email: req.params.email }, req.body, {
      new: true,
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "User not found",
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
// delete user by properties
export const deleteUserById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "User not found",
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
export const deleteUserByEmail = async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email })
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "User not found",
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
// login && register user
export const registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const isUserExist = await User.findOne({ email: req.body.email });
    if (isUserExist) {
      res.status(409).json({
        message: "User already exist",
      });
    } else {
      await newUser
        .save()
        .then(async () => {
          const token = await new Token({
            userId: newUser._id,
            token: crypto.randomBytes(3).toString("hex").toUpperCase(),
          }).save();
          await sendMail(
            newUser.email,
            "Please Verify your account",
            `Your verification code is ${token.token}`
          );
          res.status(200).json(newUser);
        })
        .catch((err) => {
          res.status(500).json({
            error: "Error at register user. error: " + err,
          });
        });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
    } else {
      let user = await User.findOne({ email: email, password: password });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
      } else {
        if (user.isVerified == false) {
          let token = await Token.findOne({ userId: user._id });
          if (!token) {
            const token = await new Token({
              userId: user._id,
              token: crypto.randomBytes(3).toString("hex").toUpperCase(),
            }).save();
            await sendMail(
              user.email,
              "Please Verify your account",
              `Your verification code is ${token.token}`
            );
            res.status(200).json(user);
          } else {
            res.status(200).json(user);
          }
        } else {
          res.status(200).json(user);
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error at login" + error });
  }
};
// verify user
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400).json({ message: "user invalid" });
    } else {
      const token = await Token.findOne({
        userId: req.params.id,
        token: req.params.token,
      });
      if (!token) {
        return res.status(400).json({ message: "invalid code" });
      } else {
        await User.findByIdAndUpdate(req.params.id, { isVerified: true });
        await token.deleteOne(user._id);
        res.status(200).json({ message: "User verified successfully" });
      }
    }
  } catch (error) {
    res.status(500).json("Error at verifying user" + error);
  }
};
// delete token by userID
export const deleteVerifyTokenByUserId = async (req, res) => {
  try {
    await Token.findOneAndDelete({ userId: req.params.id }).then((token) => {
      if (!token) {
        res.status(404).json({ message: "Token not found" });
      } else {
        res.status(200).json({ message: "Token deleted successfully" });
      }
    });
  } catch (error) {
    res.status(500).json("Error at deleting token" + error);
  }
};
// resend token
export const resendToken = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (user.isVerified) {
        res.status(400).json({ message: "User already verified" });
      } else {
        const isTokenExist = await Token.findOne({ userId: id });
        if (isTokenExist) {
          await Token.findOneAndDelete({ userId: id });
        }
        const token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(3).toString("hex").toUpperCase(),
        }).save();
        await sendMail(
          user.email,
          "Please Verify your account",
          `Your verification code is ${token.token}`
        );
        res.status(200).json({
          message: `Code resent to your email. Please confirm code!`,
        });
      }
    }
  } catch (error) {
    res.status(500).json("Error at resending token" + error);
  }
};

// add to favorites or watch later
export const addMovieToFavourites = async (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      const movie = await Movie.findById(movieId);
      if (!movie) {
        res.status(404).json({
          message: "Movie not found",
        });
      } else {
        if (user.favourites.includes(movieId)) {
          res.status(400).json({
            message: "Movie already in favourites",
          });
        } else {
          user.favourites.push(movieId);
          await user.save();
          res.status(200).json({
            message: "Movie added to favourites",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json("error: " + error);
  }
};

export const removeMovieFromFavourites = async (req, res) => {
  const userId = req.params.userId;
  const favMovieId = req.params.favMovieId;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else if (!user.favourites.includes(favMovieId)) {
    res.status(404).json({
      message: "Movie not found in favorites",
    });
  } else {
    user.favourites = user.favourites.filter((movie) => movie != favMovieId);
    await user.save();
    res.status(200).json({
      message: "Movie removed from favourites",
    });
  }
};

export const addMovieToWatchLater = async (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      res.status(404).json({
        message: "Movie not found",
      });
    } else {
      if (user.watchlater.includes(movieId)) {
        res.status(400).json({
          message: "Movie already saved to watch later",
        });
      } else {
        user.watchlater.push(movieId);
        await user.save();
        res.status(200).json({
          message: "Movie added to watch later",
        });
      }
    }
  }
};

export const removeMovieFromWatchLater = async (req, res) => {
  const userId = req.params.userId;
  const watchLaterMovieId = req.params.wlmId;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else if (!user.watchlater.includes(watchLaterMovieId)) {
    res.status(404).json({
      message: "Movie not found in watch later",
    });
  } else {
    user.watchlater = user.watchlater.filter(
      (movie) => movie != watchLaterMovieId
    );
    await user.save();
    res.status(200).json({
      message: "Movie removed from watch later",
    });
  }
};
