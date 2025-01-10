import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes";
import apiKeyMiddleware from "./middlewares/apiKeyMiddleware";
import "dotenv/config";

const app = express();
const MONGODB_KEY = process.env.MONGODB_KEY || "";
if (!MONGODB_KEY) {
  throw new Error("MONGODB_KEY is not defined in the environment variables");
}
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

mongoose
  .connect(MONGODB_KEY)
  .then(() => {
    console.log("Mongo DB connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting to Mongo DB");
    console.log(err);
  });
app.use(apiKeyMiddleware);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
