import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PendingTasks = () => {
  const { tasks, users, clients } = useData();

  // Filtrar solo las tareas pendientes
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  // Función para obtener el nombre del usuario asignado
  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Sin asignar';
  };

  // Función para obtener el nombre del cliente
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
  };

  // Función para obtener el color del badge según la prioridad
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tareas Pendientes</h1>
            <p className="text-muted-foreground mt-1">
              {pendingTasks.length} tareas pendientes de completar
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {pendingTasks.length} pendientes
          </Badge>
        </div>

        {pendingTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">¡No hay tareas pendientes!</h3>
              <p className="text-muted-foreground text-center">
                Todas las tareas han sido completadas. ¡Excelente trabajo!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority || 'Sin prioridad'}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {task.description || 'Sin descripción'}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-muted-foreground">Asignado a:</span>
                          <span className="font-medium">{getUserName(task.user_id)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span className="text-muted-foreground">Cliente:</span>
                          <span className="font-medium">{getClientName(task.client_id)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-muted-foreground">Creada:</span>
                          <span className="font-medium">
                            {task.created_at ? format(new Date(task.created_at), 'dd/MM/yyyy', { locale: es }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        Ver detalles
                      </Button>
                      <Button size="sm" variant="default">
                        Marcar completada
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PendingTasks;