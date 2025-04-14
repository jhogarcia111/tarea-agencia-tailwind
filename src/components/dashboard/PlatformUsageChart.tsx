
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from '@/context/DataContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function PlatformUsageChart() {
  const { getDailyActivityCount } = useData();
  const usageData = getDailyActivityCount();

  // Format dates for display
  const formattedData = usageData.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'dd MMM', { locale: es })
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso de la Plataforma</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                `${value} actividades`, 
                'Uso diario'
              ]}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              name="Actividades" 
              stroke="#8B5CF6" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
