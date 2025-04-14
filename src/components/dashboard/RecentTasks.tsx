
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for recent tasks
const recentTasks = [
  {
    id: 1,
    title: "Diseñar banner para campaña de Facebook",
    client: "Acme Inc.",
    assignee: "María López",
    status: "completed",
    dueDate: "2025-04-10",
  },
  {
    id: 2,
    title: "Crear copy para publicación de Instagram",
    client: "TechCorp",
    assignee: "Carlos Rodríguez",
    status: "in-progress",
    dueDate: "2025-04-15",
  },
  {
    id: 3,
    title: "Análisis de rendimiento de campaña",
    client: "Globex",
    assignee: "Ana Martínez",
    status: "pending",
    dueDate: "2025-04-20",
  },
  {
    id: 4,
    title: "Optimizar palabras clave para SEO",
    client: "Smith & Co",
    assignee: "Juan Pérez",
    status: "in-progress",
    dueDate: "2025-04-16",
  },
  {
    id: 5,
    title: "Revisión de contenido del blog",
    client: "Acme Inc.",
    assignee: "María López",
    status: "pending",
    dueDate: "2025-04-25",
  },
];

export function RecentTasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas Recientes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="grid gap-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    <span>Cliente: {task.client}</span>
                    <span className="mx-2">•</span>
                    <span>Asignado: {task.assignee}</span>
                  </div>
                </div>
                <TaskStatusBadge status={task.status} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Fecha límite: {formatDate(task.dueDate)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskStatusBadgeProps {
  status: string;
}

function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  if (status === "completed") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Completada
      </Badge>
    );
  }

  if (status === "in-progress") {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
        <Clock className="h-3 w-3 mr-1" />
        En Progreso
      </Badge>
    );
  }

  return (
    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
      <Clock className="h-3 w-3 mr-1" />
      Pendiente
    </Badge>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
