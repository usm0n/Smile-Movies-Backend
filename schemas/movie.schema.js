import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: String,
    firstname: String,
    isAdmin: { type: Boolean, default: false },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
  },
  { _id: true }
);

const movieSchema = new mongoose.Schema({
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
  notes: {
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
      type: String,
      required: false,
    },
    month: {
      type: String,
      required: false,
    },
    year: {
      type: String,
      required: false,
    },
  },
  duration: {
    hour: {
      type: String,
      required: false,
    },
    min: {
      type: String,
      required: false,
    },
  },
  rating: {
    like: {
      type: Number,
      required: false,
      default: 0,
    },
    dislike: {
      type: Number,
      required: false,
      default: 0,
    },
    imdb: {
      type: String,
      required: false,
      default: "N/A",
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
  status: {
    isNew: {
      type: Boolean,
      required: false,
      default: false,
    },
    isTrending: {
      type: Boolean,
      required: false,
      default: false,
    },
    type: {
      type: String,
      required: false,
      default: "movie",
    },
    isAvailable: {
      type: Boolean,
      required: false,
      default: true,
    }
  },
  movie: {
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
  trailer: {
    type: String,
    required: false,
    default: "",
  },
  comments: [commentSchema],
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
