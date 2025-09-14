import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path'
import { fileURLToPath } from 'url';
import connectToDb from "./db/connectToDb.js";
import lessonRoutes from "./routes/lesson.js";
import authRoutes from "./routes/auth.js";
import messageRoute from "./routes/message.js";
import cookieParser from "cookie-parser";
import corsActions, {allowedOrigins} from './config/cors.js'

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





app.use(cors(corsActions));


app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/lessons", lessonRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoute);



app.use(express.static(path.join(__dirname, '../client/build')));

app.get('**/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3002;

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
  });
});
