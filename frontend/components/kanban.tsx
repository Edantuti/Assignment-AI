"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { useTaskContext } from "@/provider/TaskProvider";

type Column = {
  id: string;
  title: string;
};

export function Board() {
  const columns: Column[] = [
    { id: "to-do", title: "To Do" },
    { id: "progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
    { id: "dump", title: "Dump" },
  ];

  const { tasks, setTasks } = useTaskContext();
  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const token = localStorage.getItem("token");
    if (source.droppableId !== destination.droppableId) {
      if (destination.droppableId === "dump") {
        const tempTask = tasks.find((task) => task._id === draggableId);
        setTasks([...tasks.filter((task) => task._id !== draggableId)]);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${draggableId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) {
          console.error(res.statusText);
          setTasks([...tasks, tempTask!]);
        }
        return;
      }
      setTasks([
        ...tasks.map((task) =>
          task._id === draggableId
            ? { ...task, status: destination.droppableId }
            : task,
        ),
      ]);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${draggableId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...tasks.find((task) => task._id === draggableId),
            status: destination.droppableId,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        console.error(response.statusText);
        setTasks([
          ...tasks.map((task) =>
            task._id === draggableId
              ? { ...task, status: source.droppableId }
              : task,
          ),
        ]);
        return;
      }
    }
  };

  return (
    <div className="p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="flex space-x-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column) => (
            <div key={column.id} className="">
              <h2 className="font-semibold mb-2">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-2 rounded-md min-h-[200px] w-64"
                  >
                    {tasks
                      .filter((task) => task.status!.toString() === column.id)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id!}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <CardContent className="p-2">
                                <h1 className="text-lg font-medium">
                                  {task.title}
                                </h1>
                                <p className="text-sm text-foreground-muted">
                                  {task.title}
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
