import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface TaskFormProps {
  editMode?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    title: string;
    description: string;
    client: string;
    assignee: string;
    status: string;
    priority: string;
    dueDate: string;
  };
}

export function TaskForm({
  editMode = false,
  onSubmit,
  onCancel,
  initialData,
}: TaskFormProps) {
  const { clients, users, addTask, updateTask, getTaskById } = useData();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const autoStatus = queryParams.get('setStatus');

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    client: initialData?.client || "",
    assignee: initialData?.assignee || "",
    status: initialData?.status || autoStatus || "pending",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate || getTomorrow(),
  });

  useEffect(() => {
    if (editMode && id) {
      const taskData = getTaskById(Number(id));
      if (taskData) {
        setFormData({
          title: taskData.title,
          description: taskData.description || "",
          client: taskData.client,
          assignee: taskData.assignee,
          status: autoStatus || taskData.status,
          priority: taskData.priority,
          dueDate: taskData.dueDate,
        });
      }
    }
  }, [editMode, id, getTaskById, autoStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && id) {
      const taskData = getTaskById(Number(id));
      if (taskData) {
        updateTask({
          ...taskData,
          title: formData.title,
          description: formData.description,
          client: formData.client,
          assignee: formData.assignee,
          status: formData.status as 'pending' | 'in-progress' | 'completed',
          priority: formData.priority as 'low' | 'medium' | 'high',
          dueDate: formData.dueDate,
        });
        toast.success("Tarea actualizada con éxito");
      }
    } else {
      addTask({
        title: formData.title,
        description: formData.description,
        client: formData.client,
        assignee: formData.assignee,
        status: formData.status as 'pending' | 'in-progress' | 'completed',
        priority: formData.priority as 'low' | 'medium' | 'high',
        dueDate: formData.dueDate,
      });
      toast.success("Tarea creada con éxito");
    }

    if (onSubmit) {
      onSubmit(formData);
    } else {
      navigate('/tasks');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/tasks');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Editar Tarea" : "Nueva Tarea"}</CardTitle>
        <CardDescription>
          {editMode
            ? "Actualice la información de la tarea"
            : "Complete el formulario para crear una nueva tarea"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título de la Tarea</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título descriptivo"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles de la tarea..."
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Select
                value={formData.client}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, client: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Asignar a</Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, assignee: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Fecha Límite</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button className="bg-brand-500 hover:bg-brand-600" type="submit">
            {editMode ? "Actualizar" : "Crear"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}
