import React from "react";
import { useData } from "@/context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TaskStateChart() {
  const { tasks } = useData();

  const taskCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { pending: 0, "in-progress": 0, completed: 0 }
  );

  const data = [
    { name: "Pendientes", count: taskCounts.pending },
    { name: "En Progreso", count: taskCounts["in-progress"] },
    { name: "Completadas", count: taskCounts.completed },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteo de Tareas por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}