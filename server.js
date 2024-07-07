import express from "express";
import mongooseConnection from "./mongo.js";
import bodyParser from "body-parser";
import appRoutes from "./route/index.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

const corsOrigin = ["http://localhost:5173"];

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

if (process.env.DEPLOY_ENV === "local") {
  app.listen(4000, (req, res) => {
    console.log(`Server is listening on port ${port}`);
  });
}
else if (process.env.DEPLOY_ENV === "prod") {
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
