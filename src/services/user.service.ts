import Token from "../schemas/token.schema";
import User from "../schemas/user.schema";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail"
import { Request, Response } from "express";

//get user by properties
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    if (!users.length) {
      res.status(404).json({ message: "Users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// update user by properties
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User updated successfully", user });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User updated successfully", user });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// delete user by properties
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User deleted" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User deleted" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    if (users.length) {
      await User.deleteMany({});
      res.status(200).json({ message: "Users deleted" });
    } else {
      res.status(404).json({ message: "Users not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// login && register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    const isUserExist = await User.findOne({ email: req.body.email });
    if (isUserExist) {
      res.status(409).json({ message: "User already exist" });
    } else {
      await newUser.save();
      const token = await new Token({
        userId: newUser._id,
        token: crypto.randomBytes(3).toString("hex").toUpperCase(),
      }).save();
      await sendMail(
        newUser.email,
        "Please Verify your account",
        `Your verification code is ${token.token}`
      );
      res.status(200).json({
        message: "User registered successfully. Please verify your account",
        user: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
    } else {
      const user = await User.findOne({ email, password });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
      } else {
        if (!user.isVerified) {
          let token = await Token.findOne({ userId: user._id });
          if (!token) {
            token = await new Token({
              userId: user._id,
              token: crypto.randomBytes(3).toString("hex").toUpperCase(),
            }).save();
            await sendMail(
              user.email,
              "Please Verify your account",
              `Your verification code is ${token.token}`
            );
            res.status(200).json({
              message: "Code sent to your email, please verify your account",
              user,
            });
          } else {
            res.status(200).json({
              message: `Code already sent to your email at ${token.createdAt}, please verify your account`,
              user,
            });
          }
        } else {
          res.status(200).json({ message: "Login successful", user });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// verify user
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400).json({ message: "User invalid" });
    } else {
      if (user.isVerified) {
        res.status(400).json({ message: "User already verified" });
      } else {
        const token = await Token.findOne({
          userId: req.params.id,
          token: req.params.token,
        });
        if (!token) {
          res.status(400).json({ message: "Invalid code" });
        } else {
          await User.findByIdAndUpdate(req.params.id, { isVerified: true });
          await token.deleteOne();
          res.status(200).json({ message: "User verified successfully" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// delete token by userID
export const deleteVerifyTokenByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const token = await Token.findOneAndDelete({ userId: req.params.id });
    if (!token) {
      res.status(404).json({ message: "Token not found" });
    } else {
      res.status(200).json({ message: "Token deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// resend token
export const resendToken = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (user.isVerified) {
        res.status(400).json({ message: "User already verified" });
      } else {
        const existingToken = await Token.findOne({ userId: req.params.id });
        if (existingToken) {
          await Token.findOneAndDelete({ userId: req.params.id });
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
        res
          .status(200)
          .json({ message: "Code resent to your email. Please confirm code!" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// add to favorites or watch later

export const addMovieToFavourites = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (user.favourites?.includes(req.params.movieId)) {
        res.status(400).json({ message: "Movie already in favourites" });
      } else {
        user.favourites?.push(req.params.movieId);
        await user.save();
        res.status(200).json({ message: "Movie added to favourites" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const removeMovieFromFavourites = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else if (!user.favourites?.includes(req.params.favMovieId)) {
      res.status(404).json({ message: "Movie not found in favorites" });
    } else {
      user.favourites = user.favourites.filter(
        (movie) => movie != req.params.favMovieId
      );
      await user.save();
      res.status(200).json({ message: "Movie removed from favourites" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const addMovieToWatchLater = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (user.watchlater?.includes(req.params.movieId)) {
        res.status(400).json({ message: "Movie already saved to watch later" });
      } else {
        user.watchlater?.push(req.params.movieId);
        await user.save();
        res.status(200).json({ message: "Movie added to watch later" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const removeMovieFromWatchLater = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else if (!user.watchlater?.includes(req.params.wlmId)) {
      res.status(404).json({ message: "Movie not found in watch later" });
    } else {
      user.watchlater = user.watchlater.filter(
        (movie) => movie != req.params.wlmId
      );
      await user.save();
      res.status(200).json({ message: "Movie removed from watch later" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// give and cancel premium
export const givePremium = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (!user.isVerified) {
        res.status(400).json({ message: "User is not verified" });
      } else {
        if (user.isPremiumUser) {
          res.status(400).json({ message: "User already has premium plan" });
        } else {
          user.isPremiumUser = true;
          await user.save();
          res.status(200).json({ message: "User given premium" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const cancelPremium = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (!user.isPremiumUser) {
        res.status(400).json({ message: "User does not have premium plan" });
      } else {
        user.isPremiumUser = false;
        await user.save();
        res.status(200).json({ message: "User cancelled premium" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
