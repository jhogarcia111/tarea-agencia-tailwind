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
import { BadgeCheck, Edit, MoreHorizontal, Search, Trash2, UserPlus, X } from "lucide-react";
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

export function UserTable() {
  const { users, deleteUser } = useData();
  const [filterText, setFilterText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.role.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete !== null) {
      deleteUser(userToDelete);
      toast.success("Usuario eliminado con éxito");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Gestione los usuarios de la agencia y sus permisos.
          </CardDescription>
        </div>
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
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => window.location.href = `/users/edit/${user.id}`}
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
                          <DropdownMenuItem onClick={() => window.location.href = `/users/edit/${user.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar usuario
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(user.id)} className="text-red-500">
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
              Esta acción no se puede deshacer. Eliminarás permanentemente el usuario y todos sus datos asociados.
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
