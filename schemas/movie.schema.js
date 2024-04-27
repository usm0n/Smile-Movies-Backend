import mongoose from "mongoose";

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
    sec: {
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
      default: "N/A"
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
    type: {
      type: String,
      required: false,
      default: "movie",
    },
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
  subtitles: {
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
  series: {
    type: Array,
    required: false,
    default: [],
  },
  trailer: {
    type: String,
    required: false,
    default: "",
  },
  comments: {
    type: Array,
    required: false,
    default: [],
  },
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
