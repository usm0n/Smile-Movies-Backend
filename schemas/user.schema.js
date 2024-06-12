import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    required: false,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  watchlater: {
    type: Array,
    required: false,
    default: [],
  },
  favourites: {
    type: Array,
    required: false,
    default: [],
  },
  isVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  isBanned: {
    type: Boolean,
    required: false,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    required: false,
    default: false,
  },
  notifications: {
    type: Boolean,
    required: false,
    default: true,
  },
  createdAt: {
    type: String,
    required: false,
    default: `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
  },
  lastLogin: {
    type: String,
    required: false,
    default: `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
