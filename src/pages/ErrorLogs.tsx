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
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const ErrorsByDayChart = ({ errorLogs }) => {
  const errorsByDay = errorLogs.reduce((acc, log) => {
    const date = new Date(log.date).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(errorsByDay).map(date => ({
    date,
    count: errorsByDay[date],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" name="Errores" stroke="#FF5733" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const ErrorTypesChart = ({ errorLogs }) => {
  const errorTypes = errorLogs.reduce((acc, log) => {
    acc[log.message] = (acc[log.message] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(errorTypes).map(type => ({
    type,
    count: errorTypes[type],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Errores" fill="#34D399" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function ErrorLogs() {
  const { errorLogs } = useData();
  
  // Sort by date descending (newest first)
  const sortedErrors = [...errorLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy HH:mm:ss", { locale: es });
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <MainLayout>
        <div className="space-y-6 md:pl-16">
          <div>
            <h1 className="text-3xl font-bold">Registro de Errores</h1>
            <p className="text-muted-foreground mt-1">
              Monitoreo de errores y problemas en la plataforma
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ErrorsByDayChart errorLogs={errorLogs} />
            <ErrorTypesChart errorLogs={errorLogs} />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Formulario</TableHead>
                  <TableHead>Mensaje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedErrors.length > 0 ? (
                  sortedErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell className="font-mono">
                        {formatDate(error.date)}
                      </TableCell>
                      <TableCell>
                        {error.userId ? `ID: ${error.userId}` : 'No autenticado'}
                      </TableCell>
                      <TableCell>
                        {error.userRole || 'N/A'}
                      </TableCell>
                      <TableCell>{error.location}</TableCell>
                      <TableCell>{error.form || 'N/A'}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {error.message}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No hay registros de errores disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
