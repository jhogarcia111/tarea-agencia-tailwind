
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Lun",
    "Nuevas": 4,
    "En Progreso": 8,
    "Completadas": 3,
  },
  {
    name: "Mar",
    "Nuevas": 5,
    "En Progreso": 10,
    "Completadas": 7,
  },
  {
    name: "Mié",
    "Nuevas": 7,
    "En Progreso": 12,
    "Completadas": 5,
  },
  {
    name: "Jue",
    "Nuevas": 3,
    "En Progreso": 15,
    "Completadas": 6,
  },
  {
    name: "Vie",
    "Nuevas": 6,
    "En Progreso": 11,
    "Completadas": 9,
  },
  {
    name: "Sáb",
    "Nuevas": 2,
    "En Progreso": 8,
    "Completadas": 4,
  },
  {
    name: "Dom",
    "Nuevas": 1,
    "En Progreso": 5,
    "Completadas": 2,
  },
];

export function TaskDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Tareas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Nuevas" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="En Progreso" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Completadas" fill="#34D399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
