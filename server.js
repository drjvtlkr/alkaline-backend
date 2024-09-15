import express, { json } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongooseConnection from "./mongo.js";
import appRoutes from "./route/index.js";
dotenv.config();
import fs from "fs";
import https from "https";

const port = process.env.PORT || 4000;

const app = express();

const corsOrigin = ["https://alkaline-admin.vercel.app", "http://localhost:5553"];

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

mongooseConnection();

app.get("/health", (req, res) => {
  return res.status(200).json({
    msg: "server, up and running",
  });
});

app.use("/api", appRoutes);

app.use((error, req, res, next) => {
  res.status(500).send("An internal server error occured");
});

if (process.env.DEPLOY_ENV === "local") {
  app.listen(4000, (req, res) => {
    console.log(`Server is listening on port ${port}`);
  });
} else if (process.env.DEPLOY_ENV === "prod") {
  const httpsServer = https.createServer(
    {
      cert: fs.readFileSync(process.env.SSL_CRT_PATH),
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
    },
    app
  );

  httpsServer.listen(4000, () => {
    console.log("HTTPS Server running on port 443");
  });
}
