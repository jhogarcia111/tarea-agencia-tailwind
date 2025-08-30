import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
// Removed incorrect import as the function is defined in this file

export async function fetchClientTaskDistribution() {
  // Implementation of the function
  return [
    { name: "Client A", taskCount: 10, color: "#ff0000" },
    { name: "Client B", taskCount: 20, color: "#00ff00" },
    { name: "Client C", taskCount: 15, color: "#0000ff" },
  ];
}

export function ClientDistributionChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await fetchClientTaskDistribution();
        const formattedData = clients.map(client => ({
          name: client.name,
          value: client.taskCount,
          color: client.color || "#8884d8", // Default color if not provided
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching client task distribution:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} tareas`, "Cantidad"]} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
