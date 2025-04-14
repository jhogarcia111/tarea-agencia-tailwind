
import { MainLayout } from "@/components/layout/MainLayout";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserPlus } from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function Users() {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const navigate = useNavigate();

  const openNewUserForm = () => {
    navigate("/users/new");
    setIsUserFormOpen(true);
  };

  const handleFormClose = () => {
    navigate("/users");
    setIsUserFormOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Usuarios</h1>
            <p className="text-muted-foreground mt-1">
              Gestione los usuarios de la agencia y sus permisos.
            </p>
          </div>
          <Button className="bg-brand-500 hover:bg-brand-600" onClick={openNewUserForm}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        <Routes>
          <Route path="/" element={<UserTable />} />
          <Route path="/new" element={
            <Sheet open={true} onOpenChange={handleFormClose}>
              <SheetContent className="sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Nuevo Usuario</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <UserForm
                    editMode={false}
                    onCancel={handleFormClose}
                  />
                </div>
              </SheetContent>
            </Sheet>
          } />
          <Route path="/edit/:id" element={
            <Sheet open={true} onOpenChange={handleFormClose}>
              <SheetContent className="sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Editar Usuario</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <UserForm
                    editMode={true}
                    onCancel={handleFormClose}
                  />
                </div>
              </SheetContent>
            </Sheet>
          } />
        </Routes>
      </div>
    </MainLayout>
  );
}
