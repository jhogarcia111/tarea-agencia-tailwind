import { useEffect, useState } from "react";
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
import { BadgeCheck, Briefcase, Edit, MoreHorizontal, Search, Trash2, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fetchClients, deleteClient as deleteClientService } from "@/lib/clientService";
import { useNavigate } from "react-router-dom";

export function ClientTable() {
  const [clients, setClients] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    loadClients();
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(filterText.toLowerCase()) ||
      client.contact.toLowerCase().includes(filterText.toLowerCase()) ||
      client.email.toLowerCase().includes(filterText.toLowerCase()) ||
      client.industry.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleDelete = async (id) => {
    console.log(`Attempting to delete client with ID: ${id}`); // Log the client ID
    try {
      await deleteClientService(id);
      setClients((prevClients) => prevClients.filter((client) => client.id !== id));
      toast.success("Cliente eliminado con éxito");
      setSelectedClient(null);
    } catch (error) {
      console.error("Error deleting client:", error.response || error.message || error);
      toast.error("Error al eliminar el cliente. Verifique el ID o el servidor.");
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedClient(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            Gestione los clientes de la agencia y sus proyectos.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-8"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            {filterText && (
              <button
                onClick={() => setFilterText("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Cliente
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Industria
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Estado
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Tareas
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                  >
                    <td className="p-4 align-middle">
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.contact} • {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">{client.industry}</Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="p-4 align-middle">
                      <Badge>{client.taskCount} tareas</Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="default"
                        onClick={() => navigate(`/clients/edit/${client.id}`)}
                      >
                        Edit
                      </Button>
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
                          <DropdownMenuItem onClick={() => window.location.href = `/clients/edit/${client.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar cliente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = `/tasks?client=${client.name}`}>
                            <Briefcase className="h-4 w-4 mr-2" />
                            Ver tareas
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
                              if (!isOpen) {
                                handleCancel(); // Ensure proper cleanup when dialog is closed
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent event propagation issues
                                    setSelectedClient(client);
                                    setDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirmar eliminación</DialogTitle>
                                  <DialogDescription>
                                    ¿Estás seguro de que deseas eliminar al cliente "{selectedClient?.name}"? Esta acción no se puede deshacer.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="secondary" onClick={handleCancel}>
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      handleDelete(selectedClient.id);
                                      setDialogOpen(false);
                                    }}
                                  >
                                    Confirmar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
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

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "active") {
    return (
      <div className="flex items-center">
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <BadgeCheck className="h-3 w-3 mr-1" />
          Activo
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <X className="h-3 w-3 mr-1" />
        Inactivo
      </Badge>
    </div>
  );
}
