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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchClients, deleteClient as deleteClientService } from "@/lib/clientService";

export function ClientTable() {
  const [clients, setClients] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

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

  const handleDeleteClick = (clientId: number) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete !== null) {
      try {
        await deleteClientService(clientToDelete);
        setClients((prevClients) => prevClients.filter((client) => client.id !== clientToDelete));
        toast.success("Cliente eliminado con éxito");
      } catch (error) {
        console.error("Error deleting client:", error);
        toast.error("Error al eliminar el cliente");
      } finally {
        setDeleteDialogOpen(false);
        setClientToDelete(null);
      }
    }
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
                    onClick={() => window.location.href = `/clients/edit/${client.id}`}
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
                          <DropdownMenuItem onClick={() => handleDeleteClick(client.id)} className="text-red-500">
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
              Esta acción no se puede deshacer. Eliminarás permanentemente el cliente y todas sus tareas asociadas.
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
