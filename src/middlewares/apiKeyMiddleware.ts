import "dotenv/config";
import { NextFunction, Request, Response } from "express";

function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKey = req.header("apiKey");
    const validApiKey = process.env.API_KEY;

    if (apiKey && apiKey === validApiKey) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  } catch (error) {
    console.log(error);
  }
}

export default apiKeyMiddleware;
