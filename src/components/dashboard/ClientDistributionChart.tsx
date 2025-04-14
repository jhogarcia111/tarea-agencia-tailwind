
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Acme Inc.", value: 15, color: "#8B5CF6" },
  { name: "TechCorp", value: 8, color: "#60A5FA" },
  { name: "Globex", value: 12, color: "#34D399" },
  { name: "Smith & Co", value: 5, color: "#F59E0B" },
  { name: "Initech", value: 9, color: "#EC4899" },
];

const COLORS = ["#8B5CF6", "#60A5FA", "#34D399", "#F59E0B", "#EC4899"];

export function ClientDistributionChart() {
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
