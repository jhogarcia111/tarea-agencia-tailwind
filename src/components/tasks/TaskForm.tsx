
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
import { useState } from "react";

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
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    client: initialData?.client || "",
    assignee: initialData?.assignee || "",
    status: initialData?.status || "pending",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Mock data for clients and assignees (users)
  const clients = [
    { id: 1, name: "Acme Inc." },
    { id: 2, name: "TechCorp" },
    { id: 3, name: "Globex" },
    { id: 4, name: "Smith & Co" },
    { id: 5, name: "Initech" },
  ];

  const users = [
    { id: 1, name: "María López" },
    { id: 2, name: "Carlos Rodríguez" },
    { id: 3, name: "Ana Martínez" },
    { id: 4, name: "Juan Pérez" },
    { id: 5, name: "Laura Sánchez" },
  ];

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
          <Button variant="outline" type="button" onClick={onCancel}>
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
