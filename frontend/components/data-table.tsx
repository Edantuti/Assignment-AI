"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useTaskContext } from "@/provider/TaskProvider";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useForm } from "react-hook-form";
export const status = ["to-do", "progress", "completed"];
export const priority = ["low", "medium", "hard"];
export enum StatusEnum {
  "to-do",
  "progress",
  "completed",
}
export enum PriorityEnum {
  "low",
  "medium",
  "hard",
}
export type TaskType = {
  _id?: string;
  title: string;
  description: string;
  status?: StatusEnum;
  priority?: PriorityEnum;
  due_date: Date;
  userId?: string;
  created_at?: Date;
  updated_at?: Date;
};

export function DataTable() {
  const { tasks: taskData, deleteTask, addTask } = useTaskContext();
  const [tasks, setTasks] = useState<TaskType[]>(taskData);
  const { register, handleSubmit } = useForm<TaskType>();
  const { toast } = useToast();
  const [status, setStatus] = useState<string>("to-do");
  const [priority, setPriority] = useState<string>("low");

  async function deleteTaskFromServer(id: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      console.error(response.statusText);
      toast({
        title: "Server Side Error",
      });
      return;
    }
    toast({
      title: "Deleted The Task",
    });
  }
  useEffect(() => {
    setTasks(taskData);
  }, [taskData]);
  async function onSubmit(data: TaskType) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`,
      {
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          due_date: data.due_date,
          status: status,
          priority: priority,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      toast({
        title: "Server Side Error",
      });
      return;
    }
    const task = await response.json();
    addTask(task);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((value) => (
            <TableRow key={value._id}>
              <TableHead>{value.title}</TableHead>
              <TableHead>{value.description}</TableHead>
              <TableHead>
                <Badge>{value.status}</Badge>
              </TableHead>
              <TableHead>
                <Badge>{value.priority}</Badge>
              </TableHead>
              <TableHead>{new Date(value.due_date).toUTCString()}</TableHead>
              {/*<TableHead>{value.due_date.toLocaleDateString()}</TableHead>*/}
              <TableHead>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    deleteTaskFromServer(value._id!);
                    deleteTask(value._id!);
                  }}
                >
                  Delete
                </Button>
              </TableHead>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Input {...register("title")} placeholder="Title" />
            </TableCell>
            <TableCell>
              <Input {...register("description")} placeholder="Description" />
            </TableCell>
            <TableCell>
              <Select
                {...register("status")}
                onValueChange={(value) => {
                  setStatus(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-do">To-do</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select
                {...register("priority")}
                onValueChange={(value) => {
                  setPriority(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Input {...register("due_date")} type="date" />
            </TableCell>
            <TableCell>
              <Button type="submit">Submit</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </form>
  );
}
