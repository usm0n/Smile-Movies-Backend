import "dotenv/config";

function apiKeyMiddleware(req, res, next) {
  try {
    const apiKey = req.header("apiKey");
    const validApiKey = process.env.API_KEY;

    if (apiKey && apiKey === validApiKey) {
      next();
    } else {
      res.render("./forbidden.hbs");
    }
  } catch (error) {
    console.log(error);
  }
}

export default apiKeyMiddleware;
