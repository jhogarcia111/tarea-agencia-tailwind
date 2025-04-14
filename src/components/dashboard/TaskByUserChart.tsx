import React from "react";
import { useData } from "@/context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TaskByUserChart() {
  const { users, tasks } = useData();

  const taskCountsByUser = users.map(user => {
    const taskCount = tasks.filter(task => task.assignee === user.name).length;
    return { name: user.name, count: taskCount };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteo de Tareas por Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskCountsByUser} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Tareas" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}