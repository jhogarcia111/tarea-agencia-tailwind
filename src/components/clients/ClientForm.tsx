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
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { createClient, updateClient as updateClientService, fetchClients } from "@/lib/clientService";

interface ClientFormProps {
  editMode?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    name: string;
    contactName: string;
    email: string;
    phone: string;
    industry: string;
    isActive: boolean;
    notes: string;
  };
}

export function ClientForm({
  editMode = false,
  onSubmit,
  onCancel,
  initialData,
}: ClientFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    contactName: initialData?.contactName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    industry: initialData?.industry || "",
    isActive: initialData?.isActive ?? true,
    notes: initialData?.notes || "",
  });

  useEffect(() => {
    if (editMode && id) {
      const loadClient = async () => {
        try {
          const clients = await fetchClients();
          const clientData = clients.find((client) => client.id === Number(id));
          if (clientData) {
            setFormData({
              name: clientData.name,
              contactName: clientData.contact,
              email: clientData.email,
              phone: clientData.phone || "",
              industry: clientData.industry,
              isActive: clientData.status === "active",
              notes: clientData.notes || "",
            });
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      };

      loadClient();
    }
  }, [editMode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editMode && id) {
        await updateClientService(Number(id), {
          name: formData.name,
          contact: formData.contactName,
          email: formData.email,
          industry: formData.industry,
          status: formData.isActive ? "active" : "inactive",
        });
        toast.success("Cliente actualizado con éxito");
      } else {
        await createClient({
          name: formData.name,
          contact: formData.contactName,
          email: formData.email,
          industry: formData.industry,
          status: formData.isActive ? "active" : "inactive",
        });
        toast.success("Cliente creado con éxito");
      }

      if (onSubmit) {
        onSubmit(formData);
      } else {
        navigate("/clients");
      }
    } catch (error) {
      console.error("Error submitting client data:", error);
      toast.error("Error al guardar el cliente");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/clients");
    }
  };

  const industries = [
    "Retail",
    "Technology",
    "Finance",
    "Healthcare",
    "Manufacturing",
    "Education",
    "Entertainment",
    "Real Estate",
    "Food & Beverage",
    "Hospitality",
    "Other",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
        <CardDescription>
          {editMode
            ? "Actualice la información del cliente"
            : "Complete el formulario para crear un nuevo cliente"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Cliente / Empresa</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre de la empresa"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactName">Nombre del Contacto</Label>
            <Input
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Nombre completo del contacto"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@empresa.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34 600 000 000"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="industry">Industria</Label>
            <Select
              value={formData.industry.toLowerCase()}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, industry: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar industria" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Añadir notas o detalles importantes sobre el cliente..."
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
            <Label htmlFor="active">Cliente Activo</Label>
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
