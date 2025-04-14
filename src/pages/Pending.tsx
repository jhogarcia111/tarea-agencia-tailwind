import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TaskTable } from '@/components/tasks/TaskTable';
import { useData } from '@/context/DataContext';

const PendingTasks = () => {
  const { tasks } = useData();

  // Filtrar las tareas pendientes
  const pendingTasks = tasks.filter(task => task.status !== 'completed');

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tareas Pendientes</h1>
        <p className="text-muted-foreground">Lista de todas las tareas que aún no han sido completadas.</p>
        <TaskTable tasks={pendingTasks} />
      </div>
    </MainLayout>
  );
};

export default PendingTasks;