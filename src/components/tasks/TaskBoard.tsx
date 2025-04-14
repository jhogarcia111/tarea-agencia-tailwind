import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TaskBoard() {
  const { tasks, updateTask } = useData();

  const [columns, setColumns] = useState({
    pending: tasks.filter((task) => task.status === "pending"),
    "in-progress": tasks.filter((task) => task.status === "in-progress"),
    completed: tasks.filter((task) => task.status === "completed"),
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1);

    destColumn.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });

    // Update task status
    updateTask({ ...movedTask, status: destination.droppableId });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, tasks]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{status.replace("-", " ").toUpperCase()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 mb-2 rounded shadow-sm"
                          >
                            {task.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}