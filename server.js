import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import apiKeyMiddleware from "./utils/apiKeyMiddleware.js";
import { engine } from "express-handlebars";
import "dotenv/config";

const app = express();
const MONGODB_KEY = process.env.MONGODB_KEY;
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));

mongoose
  .connect(MONGODB_KEY)
  .then(() => {
    console.log("Mongo DB connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting to Mongo DB");
    console.log(err);
  });
app.use((req, res) => {
  try {
    const apiKey = req.header("apiKey");
    const validApiKey = process.env.API_KEY;

    if (apiKey && apiKey === validApiKey) {
      app.use("/users", userRoutes);
      app.use("/movies", movieRoutes);
    } else {
      res.render("forbidden.hbs");
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
