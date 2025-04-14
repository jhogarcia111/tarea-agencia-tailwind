
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Tasks() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const isNewTaskRoute = location.pathname === "/tasks/new";
  const isEditTaskRoute = location.pathname.includes("/tasks/edit/");
  const queryParams = new URLSearchParams(location.search);
  const autoStatus = queryParams.get('setStatus');

  const openNewTaskForm = () => {
    navigate("/tasks/new");
    setIsTaskFormOpen(true);
  };

  const handleFormClose = () => {
    navigate("/tasks");
    setIsTaskFormOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tareas</h1>
            <p className="text-muted-foreground mt-1">
              Gestione las tareas asignadas a los clientes.
            </p>
          </div>
          <Button className="bg-brand-500 hover:bg-brand-600" onClick={openNewTaskForm}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>

        {/* Main content */}
        {!isNewTaskRoute && !isEditTaskRoute && <TaskTable />}

        {/* New task form */}
        {isNewTaskRoute && (
          <Sheet open={true} onOpenChange={handleFormClose}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Nueva Tarea</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <TaskForm
                  editMode={false}
                  onCancel={handleFormClose}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Edit task form */}
        {isEditTaskRoute && id && (
          <Sheet open={true} onOpenChange={handleFormClose}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Editar Tarea</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <TaskForm
                  editMode={true}
                  onCancel={handleFormClose}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </MainLayout>
  );
}
