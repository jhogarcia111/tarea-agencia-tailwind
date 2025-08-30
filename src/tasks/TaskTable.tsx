import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasks, fetchTasksByUserId, fetchTasksByClientId } from "../lib/clientService";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

export function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ type: "all", id: null });
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let taskData;
        if (filter.type === "user" && filter.id) {
          taskData = await fetchTasksByUserId(filter.id);
        } else if (filter.type === "client" && filter.id) {
          taskData = await fetchTasksByClientId(filter.id);
        } else {
          taskData = await fetchTasks();
        }
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      }
    };
    fetchData();
  }, [filter]);

  const handleFilterChange = (type, id) => {
    setFilter({ type, id });
  };

  const handleDelete = async (id) => {
    try {
      setTasks(tasks.filter((task) => task.id !== id));
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="filters">
        <button onClick={() => handleFilterChange("all", null)}>All Tasks</button>
        <button onClick={() => handleFilterChange("user", 1)}>User 1 Tasks</button>
        <button onClick={() => handleFilterChange("client", 1)}>Client 1 Tasks</button>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Título</th>
            <th className="px-4 py-2 border-b">Descripción</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Usuario ID</th>
            <th className="px-4 py-2 border-b">Cliente ID</th>
            <th className="px-4 py-2 border-b">Creado</th>
            <th className="px-4 py-2 border-b">Actualizado</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-4 py-2 border-b">{task.id}</td>
              <td className="px-4 py-2 border-b">{task.title}</td>
              <td className="px-4 py-2 border-b">{task.description}</td>
              <td className="px-4 py-2 border-b">{task.status}</td>
              <td className="px-4 py-2 border-b">{task.user_id}</td>
              <td className="px-4 py-2 border-b">{task.client_id}</td>
              <td className="px-4 py-2 border-b">{new Date(task.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2 border-b">{new Date(task.updated_at).toLocaleDateString()}</td>
              <td className="px-4 py-2 border-b">
                <button
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                  onClick={() => navigate(`/tasks/edit/${task.id}`)}
                >
                  Editar
                </button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        setSelectedTask(task);
                        setDialogOpen(true);
                      }}
                    >
                      Eliminar
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar eliminación</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar la tarea "
                        {selectedTask?.title}"? Esta acción no se puede deshacer.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <button
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
                        onClick={() => {
                          handleDelete(selectedTask.id);
                          setDialogOpen(false);
                        }}
                      >
                        Confirmar
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
