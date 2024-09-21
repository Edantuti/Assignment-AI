import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth.route";
import tasksRouter from "./routes/task.route";
import { connectDB } from "./utils";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else app.use(morgan("common"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.get("/api", async (req: Request, res: Response) => {
  res.json({ message: "API is working fine" });
});

app.listen(port, () => {
  console.log("The server is up and running at port:", port);
  connectDB();
});
