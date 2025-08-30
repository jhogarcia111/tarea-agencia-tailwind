import { useState, useEffect } from "react";
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
  Edit,
  MoreHorizontal, 
  Search, 
  Trash2,
  XCircle 
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation, useNavigate } from "react-router-dom";

interface TaskTableProps {
  selectedDate?: Date | null;
}

export function TaskTable({ selectedDate }: TaskTableProps) {
  const { tasks, deleteTask, users, clients } = useData();
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const location = useLocation();
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

  // Parse query parameters to filter by client if needed
  const queryParams = new URLSearchParams(location.search);
  const clientFilter = queryParams.get('client');

  const filteredTasks = tasks.filter(
    (task) =>
      // Text filter
      (task.title.toLowerCase().includes(filterText.toLowerCase()) ||
        getClientName(task.client_id).toLowerCase().includes(filterText.toLowerCase()) ||
        getUserName(task.user_id).toLowerCase().includes(filterText.toLowerCase())) &&
      // Status filter
      (statusFilter === "all" || task.status === statusFilter) &&
      // Client filter
      (clientFilter ? getClientName(task.client_id) === clientFilter : true) &&
      // Date filter
      (selectedDate ? 
        (task.dueDate && new Date(task.dueDate).toDateString() === selectedDate.toDateString()) : 
        true)
  );

  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete);
      toast.success("Tarea eliminada con éxito");
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // If we have a client filter, update the page title
  useEffect(() => {
    if (clientFilter) {
      document.title = `Tareas de ${clientFilter}`;
    } else {
      document.title = "Tareas";
    }
  }, [clientFilter]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            {selectedDate 
              ? `Tareas para ${selectedDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`
              : clientFilter 
                ? `Tareas de ${clientFilter}` 
                : "Tareas"
            }
          </CardTitle>
          <CardDescription>
            {selectedDate 
              ? `Tareas con fecha límite el ${selectedDate.toLocaleDateString()}`
              : "Gestione las tareas asignadas a los clientes."
            }
          </CardDescription>
        </div>
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
                  <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">
                    Fecha Creada
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
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/tasks/edit/${task.id}`)}
                  >
                    <td className="p-4 align-middle">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {getClientName(task.client_id)} • {getUserName(task.user_id)}
                        </div>
                        <div className="md:hidden mt-1">
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      {getClientName(task.client_id)}
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      {getUserName(task.user_id)}
                    </td>
                    <td className="p-4 align-middle">
                      <TaskStatusBadge status={task.status} />
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      <div className="flex items-center">
                        <span className="mr-2">{task.dueDate ? formatDate(task.dueDate) : 'Sin fecha límite'}</span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </td>
                    <td className="p-4 align-middle hidden md:table-cell">
                      {formatDate(task.created_at)}
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
                          <DropdownMenuItem onClick={() => navigate(`/tasks/edit/${task.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar tarea
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            const newStatus = task.status === 'pending' ? 'in-progress' : 
                                             task.status === 'in-progress' ? 'completed' : 'pending';
                            // This functionality will be implemented in TaskForm
                            navigate(`/tasks/edit/${task.id}?setStatus=${newStatus}`);
                          }}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Cambiar estado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(task.id)} className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Eliminarás permanentemente esta tarea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
