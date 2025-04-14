
import { MainLayout } from "@/components/layout/MainLayout";
import { ClientTable } from "@/components/clients/ClientTable";
import { ClientForm } from "@/components/clients/ClientForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Briefcase } from "lucide-react";

export default function Clients() {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);

  const openNewClientForm = () => {
    setIsEditing(false);
    setCurrentClient(null);
    setIsClientFormOpen(true);
  };

  const openEditClientForm = (client: any) => {
    setIsEditing(true);
    setCurrentClient(client);
    setIsClientFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    // Here you would handle the form submission
    // For now, we'll just close the form
    console.log("Form submitted with data:", data);
    setIsClientFormOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Gestione los clientes de la agencia y sus proyectos.
            </p>
          </div>
          <Button className="bg-brand-500 hover:bg-brand-600" onClick={openNewClientForm}>
            <Briefcase className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        <ClientTable />

        <Sheet open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <ClientForm
                editMode={isEditing}
                initialData={currentClient}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsClientFormOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </MainLayout>
  );
}
