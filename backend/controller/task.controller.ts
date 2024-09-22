import { Request, Response } from "express";
import Task from "../models/task.model";
import User from "../models/user.model";

export const getTasks = async (req: Request, res: Response) => {
  const { id } = req.user!;
  try {
    const tasks = await Task.find({ userId: id });
    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, status, priority, due_date } = req.body;
  console.log(req.body);
  const { id } = req.user!;
  const task = new Task({
    title,
    description,
    status,
    priority,
    userId: id,
    due_date,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await Task.updateOne(
      {
        _id: task._id,
      },
      {
        title: req.body.title || task.title,
        description: req.body.description || task.description,
        status: req.body.status || task.status,
        priority: req.body.priority || task.priority,
        due_date: req.body.due_date || task.due_date,
      },
    );

    const newTask = await Task.findById(req.params.id);
    res.status(200).json(newTask);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
