import express from "express";
import cors from "cors";
import "dotenv/config";
import apiKeyMiddleware from "./middlewares/apiKey.middleware";
import userRouter from "./routes/users.routes";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/google", (req, res) => {
  const decoded = jwt.decode(
    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZhMDcyZjc1Nzg0NjQyNjE1MDg3YzcxODJjMTAxMzQxZTE4ZjdhM2EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4ODAwMjg4MzQ0ODktOThmcDhic2I1N2JkOG8wMTNzdGhlY3JiZG5sZ25oZjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4ODAwMjg4MzQ0ODktOThmcDhic2I1N2JkOG8wMTNzdGhlY3JiZG5sZ25oZjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTUxNjI5MzYxODk3MjA0MDgwNTMiLCJlbWFpbCI6InVzbW9uLnVtYXJvdmljaC4wOUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzM4NDk2OTYwLCJuYW1lIjoiVXNtb24gVW1hcm92aWNoIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pXLVNJQllqMXMtXy1DMk81dktodGpaQU9KN1pxSTU4WFFvOWFaLXE3Y0VnUGd5YURjPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlVzbW9uIiwiZmFtaWx5X25hbWUiOiJVbWFyb3ZpY2giLCJpYXQiOjE3Mzg0OTcyNjAsImV4cCI6MTczODUwMDg2MCwianRpIjoiZGYwZDM4YjIxNzhjZWM2YzRiYzYzMGE4NmZlMGE0ZWY4OTY4YWI1OCJ9.TOk2NXQY2T2xqEgFdOgJ1pyuyqidHn7kN4VYAVWUWFNsmLvjFityw7aUqweAwfLAQf-sDTu5qFwFGWqqADfwJTnevNFzDYAlxSSjBYEq_RuJV7333qVsNPaKv2Jf7Y5AJbr4zlBOmQInMLnY4jpNZs6WHoUWAt3gj1mSigwzh2ybSCjiRYAVDz0aZQ4qjccTdssubGC-Wfj98CnTZNVMyBZLkXAJvlmvVB8X6DoCJSX525FvKtNn1f0jnhxKAKPCHJPMUq3I_7mIwuLUTAvN_h8vJzkOPTaRS2T3t9UMzlrgtMTuDBa-Xcxolbd4W_uPSoR1ZzuoCs9VZUpJQr9OLA"
  );
  res.json(decoded);
});

app.use(apiKeyMiddleware);
app.get("/", apiKeyMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Smile Movies API" });
});
app.use("/api/v3/users", userRouter);

app.listen(PORT, () => {
  console.log(`Running server with port ${PORT}`);
});
