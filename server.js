import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://usmondev:smilemovieusmonpassword@cluster0.3zs9zzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Mongo DB connected successfully");
  })
  .catch(() => {
    console.log("Error connecting to Mongo DB");
  });

app.use("/users", userRoutes);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
