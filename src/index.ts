import express from "express";
import cors from "cors";
import "dotenv/config";
import apiKeyMiddleware from "./middlewares/apiKey.middleware";
import userRouter from "./routes/users.routes";
import { proxy } from "./controllers/playerProxy.controller";
import { createProxyMiddleware } from "http-proxy-middleware";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
app.use("/vidsrc", (req, res, next) => {
  req.headers["cookie"] = req.headers["cookie"] || "";
  next();
});
app.use(
  "/vidsrc",
  createProxyMiddleware({
    target: "https://vidsrc.xyz",
    changeOrigin: true,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://vidsrc.xyz/",
    },
    onProxyReq: function (
      proxyReq: import("http").ClientRequest,
      req: express.Request,
      res: express.Response
    ) {
      proxyReq.setHeader("User-Agent", req.headers["user-agent"] || "");
      proxyReq.setHeader("Referer", "https://vidsrc.xyz/");
    },
  } as any)
);
app.use(apiKeyMiddleware);
app.get("/", apiKeyMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Smile Movies API" });
});
app.use("/api/v3/users", userRouter);

app.listen(PORT, () => {
  console.log(`Running server with port ${PORT}`);
});
