"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { TaskType } from "@/components/data-table";
import { useRouter } from "next/navigation";

interface TaskContextType {
  tasks: TaskType[];
  addTask: (task: TaskType) => void;
  updateTask: (updatedTask: TaskType) => void;
  deleteTask: (taskId: string) => void;
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const router = useRouter();
  const addTask = (task: TaskType) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const updateTask = (updatedTask: TaskType) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task,
      ),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id?.toString() !== taskId),
    );
  };

  async function getTasks() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      console.error(`${response.status},${response.statusText}`);

      if (response.status == 403) {
        router.push("/auth");
      }
      return [];
    }
    const data = await response.json();
    return data;
  }
  useEffect(() => {
    getTasks().then((data) => {
      setTasks(data);
    });
  }, []);
  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, setTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};
