
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { useData } from '@/context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ActivityLogs() {
  const { activityLogs, auth } = useData();
  
  // Sort by date descending (newest first)
  const sortedActivities = [...activityLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy HH:mm:ss", { locale: es });
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div>
          <h1 className="text-3xl font-bold">Registro de Actividades</h1>
          <p className="text-muted-foreground mt-1">
            Historial de acciones realizadas en la plataforma
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Ubicación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedActivities.length > 0 ? (
                sortedActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-mono">
                      {formatDate(activity.date)}
                    </TableCell>
                    <TableCell>{activity.userName}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.location}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No hay registros de actividad disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
