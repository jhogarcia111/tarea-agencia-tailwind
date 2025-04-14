
import { MainLayout } from "@/components/layout/MainLayout";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus } from "lucide-react";

export default function Tasks() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);

  const openNewTaskForm = () => {
    setIsEditing(false);
    setCurrentTask(null);
    setIsTaskFormOpen(true);
  };

  const openEditTaskForm = (task: any) => {
    setIsEditing(true);
    setCurrentTask(task);
    setIsTaskFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    // Here you would handle the form submission
    // For now, we'll just close the form
    console.log("Form submitted with data:", data);
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

        <TaskTable />

        <Sheet open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {isEditing ? "Editar Tarea" : "Nueva Tarea"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <TaskForm
                editMode={isEditing}
                initialData={currentTask}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsTaskFormOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </MainLayout>
  );
}
