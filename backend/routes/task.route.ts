import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controller/task.controller";
import { authenticateJWT } from "../middleware/jwt.middleware";

const router = express.Router();

router.get("/", authenticateJWT, getTasks);
router.get("/:id", authenticateJWT, getTaskById);
router.post("/", authenticateJWT, createTask);
router.put("/:id", authenticateJWT, updateTask);
router.delete("/:id", authenticateJWT, deleteTask);
export default router;
