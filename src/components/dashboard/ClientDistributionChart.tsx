import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";

export async function getClients(): Promise<{ name: string; value: number; color: string }[]> {
  // Ensure this function returns a promise resolving to an array of clients
  return [
    { name: "Client A", value: 10, color: "#FF0000" },
    { name: "Client B", value: 20, color: "#00FF00" },
    { name: "Client C", value: 30, color: "#0000FF" },
  ];
}

export function ClientDistributionChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const clients = await getClients();
      const formattedData = clients.map(client => ({
        name: client.name,
        value: client.value,
        color: client.color,
      }));
      setData(formattedData);
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
