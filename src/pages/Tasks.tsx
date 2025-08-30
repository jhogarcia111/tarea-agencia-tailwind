import { MainLayout } from "@/components/layout/MainLayout";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskDeadlineCalendar } from "@/components/ui/calendar";
import { TaskTrendChart } from "@/components/dashboard/TaskTrendChart";

export default function Tasks() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
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

        <div className="grid gap-6 md:grid-cols-2">
          <TaskDeadlineCalendar onDateClick={handleDateClick} />
          <TaskTrendChart />
        </div>

        {/* Main content */}
        {!isNewTaskRoute && !isEditTaskRoute && (
          <>
            {selectedDate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Tareas para {selectedDate.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                  >
                    Ver todas las tareas
                  </Button>
                </div>
                <TaskTable selectedDate={selectedDate} />
              </div>
            )}
            {!selectedDate && <TaskTable />}
          </>
        )}

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
            <SheetContent className="sm:max-w-md overflow-y-auto" style={{ zIndex: 9999 }}>
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
