import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { fetchTaskCountsByClient } from "@/lib/clientService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TaskByClientChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskCounts = await fetchTaskCountsByClient();
        if (Array.isArray(taskCounts)) {
          const formattedData = taskCounts.map(item => ({
            name: item.client_name,
            count: item.task_count,
          }));
          setData(formattedData);
        } else {
          console.error("Invalid data format:", taskCounts);
          setError("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching task counts by client:", error);
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteo de Tareas por Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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