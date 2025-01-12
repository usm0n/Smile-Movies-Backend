import express from "express";
import cors from "cors";
import "dotenv/config";
import apiKeyMiddleware from "./middlewares/apiKeyMiddleware";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(apiKeyMiddleware);
app.get("/", apiKeyMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Smile Movies API" });
});

app.listen(PORT, () => {
  console.log(`Running server with port ${PORT}`);
});
