
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  Plus, 
  Search, 
  XCircle 
} from "lucide-react";
import { Badge } from "../ui/badge";

// Mock task data
const tasks = [
  {
    id: 1,
    title: "Diseñar banner para campaña de Facebook",
    client: "Acme Inc.",
    assignee: "María López",
    status: "completed",
    dueDate: "2025-04-10",
    priority: "high",
  },
  {
    id: 2,
    title: "Crear copy para publicación de Instagram",
    client: "TechCorp",
    assignee: "Carlos Rodríguez",
    status: "in-progress",
    dueDate: "2025-04-15",
    priority: "medium",
  },
  {
    id: 3,
    title: "Análisis de rendimiento de campaña",
    client: "Globex",
    assignee: "Ana Martínez",
    status: "pending",
    dueDate: "2025-04-20",
    priority: "medium",
  },
  {
    id: 4,
    title: "Optimizar palabras clave para SEO",
    client: "Smith & Co",
    assignee: "Juan Pérez",
    status: "in-progress",
    dueDate: "2025-04-16",
    priority: "high",
  },
  {
    id: 5,
    title: "Revisión de contenido del blog",
    client: "Acme Inc.",
    assignee: "María López",
    status: "pending",
    dueDate: "2025-04-25",
    priority: "low",
  },
  {
    id: 6,
    title: "Actualizar página de contacto",
    client: "TechCorp",
    assignee: "Carlos Rodríguez",
    status: "pending",
    dueDate: "2025-04-30",
    priority: "low",
  },
  {
    id: 7,
    title: "Preparar informe mensual",
    client: "Globex",
    assignee: "Ana Martínez",
    status: "in-progress",
    dueDate: "2025-04-28",
    priority: "high",
  },
  {
    id: 8,
    title: "Diseño de newsletter",
    client: "Initech",
    assignee: "Laura Sánchez",
    status: "completed",
    dueDate: "2025-04-05",
    priority: "medium",
  },
];

export function TaskTable() {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTasks = tasks.filter(
    (task) =>
      (task.title.toLowerCase().includes(filterText.toLowerCase()) ||
        task.client.toLowerCase().includes(filterText.toLowerCase()) ||
        task.assignee.toLowerCase().includes(filterText.toLowerCase())) &&
      (statusFilter === "all" || task.status === statusFilter)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tareas</CardTitle>
          <CardDescription>
            Gestione las tareas asignadas a los clientes.
          </CardDescription>
        </div>
        <Button className="bg-brand-500 hover:bg-brand-600">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tarea
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tareas..."
              className="pl-8 w-full"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <FilterButton
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              Todas
            </FilterButton>
            <FilterButton
              active={statusFilter === "pending"}
              onClick={() => setStatusFilter("pending")}
            >
              Pendientes
            </FilterButton>
            <FilterButton
              active={statusFilter === "in-progress"}
              onClick={() => setStatusFilter("in-progress")}
            >
              En Progreso
            </FilterButton>
            <FilterButton
              active={statusFilter === "completed"}
              onClick={() => setStatusFilter("completed")}
            >
              Completadas
            </FilterButton>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Tarea
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">
                    Cliente
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">
                    Asignado
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Estado
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">
                    Fecha Límite
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {task.client} • {task.assignee}
                        </div>
                        <div className="md:hidden mt-1">
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      {task.client}
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      {task.assignee}
                    </td>
                    <td className="p-4 align-middle">
                      <TaskStatusBadge status={task.status} />
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      <div className="flex items-center">
                        <span className="mr-2">{formatDate(task.dueDate)}</span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar tarea</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                          <DropdownMenuItem>Reasignar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={active ? "bg-brand-500 hover:bg-brand-600" : ""}
    >
      {children}
    </Button>
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

interface PriorityBadgeProps {
  priority: string;
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (priority === "high") {
    return (
      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
        Alta
      </Badge>
    );
  }

  if (priority === "medium") {
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
        Media
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
      Baja
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
