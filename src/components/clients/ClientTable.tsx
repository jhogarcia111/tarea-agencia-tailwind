
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
import { BadgeCheck, Briefcase, MoreHorizontal, Search, X } from "lucide-react";
import { Badge } from "../ui/badge";

// Mock client data
const clients = [
  {
    id: 1,
    name: "Acme Inc.",
    contact: "John Smith",
    email: "john@acme.com",
    status: "active",
    taskCount: 15,
    industry: "Retail",
  },
  {
    id: 2,
    name: "TechCorp",
    contact: "Emma Johnson",
    email: "emma@techcorp.com",
    status: "active",
    taskCount: 8,
    industry: "Technology",
  },
  {
    id: 3,
    name: "Globex",
    contact: "Michael Brown",
    email: "michael@globex.com",
    status: "active",
    taskCount: 12,
    industry: "Finance",
  },
  {
    id: 4,
    name: "Smith & Co",
    contact: "Sarah Williams",
    email: "sarah@smithco.com",
    status: "inactive",
    taskCount: 5,
    industry: "Healthcare",
  },
  {
    id: 5,
    name: "Initech",
    contact: "David Miller",
    email: "david@initech.com",
    status: "active",
    taskCount: 9,
    industry: "Manufacturing",
  },
];

export function ClientTable() {
  const [filterText, setFilterText] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(filterText.toLowerCase()) ||
      client.contact.toLowerCase().includes(filterText.toLowerCase()) ||
      client.email.toLowerCase().includes(filterText.toLowerCase()) ||
      client.industry.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            Gestione los clientes de la agencia y sus proyectos.
          </CardDescription>
        </div>
        <Button className="bg-brand-500 hover:bg-brand-600">
          <Briefcase className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
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
                    className="border-b transition-colors hover:bg-muted/50"
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
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar cliente</DropdownMenuItem>
                          <DropdownMenuItem>Ver tareas</DropdownMenuItem>
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
