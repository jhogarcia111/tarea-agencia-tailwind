
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function RecentTasks() {
  const { tasks, users, clients } = useData();
  const navigate = useNavigate();

  // Función para obtener el nombre del usuario asignado
  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Sin asignar';
  };

  // Función para obtener el nombre del cliente
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  // Obtener las 5 tareas más recientes
  const recentTasks = tasks
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Función para navegar a la edición de la tarea
  const handleTaskClick = (taskId: number) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  // Si no hay tareas, mostrar mensaje
  if (recentTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tareas Recientes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay tareas recientes</p>
            <p className="text-sm">Las tareas aparecerán aquí cuando se creen</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>Tareas Recientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentTasks.map((task) => (
              <Tooltip key={task.id}>
                <TooltipTrigger asChild>
                  <div
                    className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="grid gap-1 flex-1">
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {task.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span>Cliente: {getClientName(task.client_id)}</span>
                          <span className="mx-2">•</span>
                          <span>Asignado: {getUserName(task.user_id)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <TaskStatusBadge status={task.status} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Creada: {formatDate(task.created_at)}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Haz clic para editar esta tarea</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
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
