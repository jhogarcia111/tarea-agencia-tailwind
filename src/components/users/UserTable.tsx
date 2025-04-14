
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
import { BadgeCheck, MoreHorizontal, Search, Trash2, UserPlus, X } from "lucide-react";
import { Badge } from "../ui/badge";

// Mock user data
const users = [
  {
    id: 1,
    name: "María López",
    email: "maria@agencia.com",
    role: "admin",
    status: "active",
    avatar: "ML",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos@agencia.com",
    role: "designer",
    status: "active",
    avatar: "CR",
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana@agencia.com",
    role: "marketing",
    status: "active",
    avatar: "AM",
  },
  {
    id: 4,
    name: "Juan Pérez",
    email: "juan@agencia.com",
    role: "copywriter",
    status: "inactive",
    avatar: "JP",
  },
  {
    id: 5,
    name: "Laura Sánchez",
    email: "laura@agencia.com",
    role: "manager",
    status: "active",
    avatar: "LS",
  },
];

export function UserTable() {
  const [filterText, setFilterText] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.role.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Gestione los usuarios de la agencia y sus permisos.
          </CardDescription>
        </div>
        <Button className="bg-brand-500 hover:bg-brand-600">
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
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
                    Usuario
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Rol
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Estado
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-800 font-medium">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="p-4 align-middle">
                      <StatusBadge status={user.status} />
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
                          <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar permisos</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
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

interface RoleBadgeProps {
  role: string;
}

function RoleBadge({ role }: RoleBadgeProps) {
  const roleMappings: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    admin: { label: "Administrador", variant: "default" },
    manager: { label: "Gestor", variant: "secondary" },
    designer: { label: "Diseñador", variant: "outline" },
    marketing: { label: "Marketing", variant: "outline" },
    copywriter: { label: "Redactor", variant: "outline" },
  };

  const { label, variant } = roleMappings[role] || { label: role, variant: "outline" };

  return <Badge variant={variant}>{label}</Badge>;
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
