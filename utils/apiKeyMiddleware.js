import "dotenv/config";

function apiKeyMiddleware(req, res, next) {
  try {
    const apiKey = req.header("apiKey");
    const validApiKey = process.env.API_KEY;

    if (apiKey && apiKey === validApiKey) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
  }
}

export default apiKeyMiddleware;
