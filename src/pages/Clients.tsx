import { MainLayout } from "@/components/layout/MainLayout";
import { ClientTable } from "@/components/clients/ClientTable";
import { ClientForm } from "@/components/clients/ClientForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Briefcase } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskByClientChart } from "@/components/dashboard/TaskByClientChart";
import { TaskByUserChart } from "@/components/dashboard/TaskByUserChart";
import { ClientDistributionChart } from "@/components/dashboard/ClientDistributionChart";

// Agregar las propiedades faltantes al tipo Client
export interface Client {
  industry: string;
  id: number;
  name: string;
  email: string;
  contactName: string; // Propiedad obligatoria
  phone?: string; // Propiedad opcional
  isActive?: boolean; // Propiedad opcional
  notes?: string; // Propiedad opcional
  // otras propiedades
}

export function useData() {
  const getClientById = (id: number): Client | undefined => {
    // Mock implementation for demonstration purposes
    const clients: Client[] = [
      {
        id: 1,
        name: "Client A",
        email: "clienta@example.com",
        contactName: "John Doe",
        industry: "Technology",
      },
      {
        id: 2,
        name: "Client B",
        email: "clientb@example.com",
        contactName: "Jane Smith",
        industry: "Finance",
      },
    ];
    return clients.find(client => client.id === id);
  };
  return { getClientById };
}

export default function Clients() {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { getClientById } = useData();
  
  const isNewClientRoute = location.pathname === "/clients/new";
  const isEditClientRoute = location.pathname.includes("/clients/edit/");

  const openNewClientForm = () => {
    navigate("/clients/new");
    setIsClientFormOpen(true);
  };

  const handleFormClose = () => {
    navigate("/clients");
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

        <div className="grid gap-6 md:grid-cols-3">
          <ClientDistributionChart />
          <TaskByUserChart />
          <TaskByClientChart />
        </div>

        {/* Main content */}
        {!isNewClientRoute && !isEditClientRoute && (
          <>
            <ClientTable />
          </>
        )}

        {/* New client form */}
        {isNewClientRoute && (
          <Sheet open={true} onOpenChange={handleFormClose}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Nuevo Cliente</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ClientForm
                  editMode={false}
                  onCancel={handleFormClose}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Edit client form */}
        {isEditClientRoute && id && (
          <Sheet open={true} onOpenChange={handleFormClose}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Editar Cliente</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ClientForm
                  editMode={true}
                  onCancel={handleFormClose}
                  initialData={
                    id
                      ? {
                          ...getClientById(Number(id)),
                          contactName: getClientById(Number(id))?.contactName || "",
                          phone: getClientById(Number(id))?.phone || "",
                          isActive: getClientById(Number(id))?.isActive || false,
                          notes: getClientById(Number(id))?.notes || "",
                          industry: getClientById(Number(id))?.industry || "",
                        }
                      : undefined
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </MainLayout>
  );
}
