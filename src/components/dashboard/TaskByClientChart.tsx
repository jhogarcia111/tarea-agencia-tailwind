import React from "react";
import { useData } from "@/context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TaskByClientChart() {
  const { clients, tasks } = useData();

  const taskCountsByClient = clients.map(client => {
    const taskCount = tasks.filter(task => task.client === client.name).length;
    return { name: client.name, count: taskCount };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteo de Tareas por Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskCountsByClient} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Tareas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}