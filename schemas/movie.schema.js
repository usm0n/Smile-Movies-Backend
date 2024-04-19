import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  isAvailable: {
    uz: {
      type: Boolean,
      required: false,
      default: false,
    },
    ru: {
      type: Boolean,
      required: false,
      default: false,
    },
    en: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  title: {
    uz: {
      type: String,
      required: false,
    },
    ru: {
      type: String,
      required: false,
    },
    en: {
      type: String,
      required: false,
    },
  },
  description: {
    uz: {
      type: String,
      required: false,
    },
    ru: {
      type: String,
      required: false,
    },
    en: {
      type: String,
      required: false,
    },
  },
  releaseDate: {
    day: {
      type: Number,
      required: false,
    },
    month: {
      type: Number,
      required: false,
    },
    year: {
      type: Number,
      required: false,
    },
  },
  durability: {
    type: String,
    required: false,
  },
  rating: {
    like: {
      type: Number,
      required: false,
    },
    dislike: {
      type: Number,
      required: false,
    },
  },
  country: {
    uz: {
      type: String,
      required: false,
    },
    ru: {
      type: String,
      required: false,
    },
    en: {
      type: String,
      required: false,
    },
  },
  credit: {
    type: String,
    required: false,
  },
  image: {
    portrait: {
      type: String,
      required: false,
    },
    fullscreen: {
      type: String,
      required: false,
    },
  },
  isNew: {
    type: Boolean,
    required: false,
    default: false,
  },
  movie: {
    uz: {
      "480p": {
        type: String,
        required: false,
      },
      "720p": {
        type: String,
        required: false,
      },
      "1080p": {
        type: String,
        required: false,
      },
    },
    ru: {
      "480p": {
        type: String,
        required: false,
      },
      "720p": {
        type: String,
        required: false,
      },
      "1080p": {
        type: String,
        required: false,
      },
    },
    en: {
      "480p": {
        type: String,
        required: false,
      },
      "720p": {
        type: String,
        required: false,
      },
      "1080p": {
        type: String,
        required: false,
      },
    },
  },
  comments: {
    type: Array,
    required: false,
    default: [],
  },
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
