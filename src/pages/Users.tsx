
import { MainLayout } from "@/components/layout/MainLayout";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserPlus } from "lucide-react";

export default function Users() {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const openNewUserForm = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setIsUserFormOpen(true);
  };

  const openEditUserForm = (user: any) => {
    setIsEditing(true);
    setCurrentUser(user);
    setIsUserFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    // Here you would handle the form submission
    // For now, we'll just close the form
    console.log("Form submitted with data:", data);
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

        <UserTable />

        <Sheet open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <UserForm
                editMode={isEditing}
                initialData={currentUser}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsUserFormOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </MainLayout>
  );
}
