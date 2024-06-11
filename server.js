import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use("/users", userRoutes);
app.use("/movies", movieRoutes)

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
