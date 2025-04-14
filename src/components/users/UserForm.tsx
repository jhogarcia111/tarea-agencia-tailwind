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
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

interface UserFormProps {
  editMode?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

export function UserForm({
  editMode = false,
  onSubmit,
  onCancel,
  initialData,
}: UserFormProps) {
  const { addUser, updateUser, getUserById } = useData();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "",
    isActive: initialData?.isActive ?? true,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (editMode && id) {
      const userData = getUserById(Number(id));
      if (userData) {
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isActive: userData.status === 'active',
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [editMode, id, getUserById]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editMode && formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (editMode && id) {
      const userData = getUserById(Number(id));
      if (userData) {
        updateUser({
          ...userData,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.isActive ? 'active' : 'inactive',
        });
        toast.success("Usuario actualizado con éxito");
      }
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.isActive ? 'active' : 'inactive',
      });
      toast.success("Usuario creado con éxito");
    }

    if (onSubmit) {
      onSubmit(formData);
    } else {
      navigate('/users');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/users');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Editar Usuario" : "Nuevo Usuario"}</CardTitle>
        <CardDescription>
          {editMode
            ? "Actualice la información del usuario"
            : "Complete el formulario para crear un nuevo usuario"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@agencia.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Gestor</SelectItem>
                <SelectItem value="designer">Diseñador</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="copywriter">Redactor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
            <Label htmlFor="active">Usuario Activo</Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={editMode ? "Dejar en blanco para no cambiar" : "Contraseña"}
              required={!editMode}
            />
          </div>
          {!editMode && (
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                required={!editMode}
              />
            </div>
          )}
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
