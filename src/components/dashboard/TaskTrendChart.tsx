import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useData } from "@/context/DataContext";
import { format, subDays, startOfDay, parseISO, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Timeframe = 'daily' | 'weekly' | 'monthly';
type Period = '7days' | '15days' | '30days' | 'all';

export function TaskTrendChart() {
  const { tasks } = useData();
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [period, setPeriod] = useState<Period>('30days');

  const generateChartData = () => {
    const today = new Date();
    let startDate: Date;
    let daysToShow: number;

    // Determinar período
    switch (period) {
      case '7days':
        startDate = subDays(today, 7);
        daysToShow = 7;
        break;
      case '15days':
        startDate = subDays(today, 15);
        daysToShow = 15;
        break;
      case '30days':
        startDate = subDays(today, 30);
        daysToShow = 30;
        break;
      case 'all':
        // Mostrar desde la primera tarea hasta hoy
        const firstTaskDate = tasks.length > 0 
          ? new Date(Math.min(...tasks.map(t => new Date(t.created_at).getTime())))
          : subDays(today, 30);
        startDate = firstTaskDate;
        daysToShow = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        break;
      default:
        startDate = subDays(today, 30);
        daysToShow = 30;
    }

    const data = [];
    
    if (timeframe === 'daily') {
      // Datos diarios
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = subDays(today, i);
        const dateKey = format(date, 'yyyy-MM-dd');
        const displayDate = format(date, 'dd-MMM', { locale: es });

        const createdTasks = tasks.filter(task => {
          if (!task.created_at) return false;
          const taskDate = format(new Date(task.created_at), 'yyyy-MM-dd');
          return taskDate === dateKey;
        }).length;

        const completedTasks = tasks.filter(task => {
          if (task.status !== 'completed') return false;
          const taskDate = format(new Date(task.updated_at), 'yyyy-MM-dd');
          return taskDate === dateKey;
        }).length;

        data.push({
          date: displayDate,
          creadas: createdTasks,
          completadas: completedTasks,
          fullDate: dateKey,
        });
      }
    } else if (timeframe === 'weekly') {
      // Datos semanales
      const weeks = Math.ceil(daysToShow / 7);
      for (let i = weeks - 1; i >= 0; i--) {
        const weekStart = subDays(today, i * 7);
        const weekEnd = subDays(today, (i * 7) - 6);
        const weekKey = `Sem ${format(weekStart, 'dd/MM')}`;

        const createdTasks = tasks.filter(task => {
          if (!task.created_at) return false;
          const taskDate = new Date(task.created_at);
          return isWithinInterval(taskDate, { start: weekEnd, end: weekStart });
        }).length;

        const completedTasks = tasks.filter(task => {
          if (task.status !== 'completed') return false;
          const taskDate = new Date(task.updated_at);
          return isWithinInterval(taskDate, { start: weekEnd, end: weekStart });
        }).length;

        data.push({
          date: weekKey,
          creadas: createdTasks,
          completadas: completedTasks,
          fullDate: format(weekStart, 'yyyy-MM-dd'),
        });
      }
    } else {
      // Datos mensuales
      const months = Math.ceil(daysToShow / 30);
      for (let i = months - 1; i >= 0; i--) {
        const monthStart = subDays(today, i * 30);
        const monthEnd = subDays(today, (i * 30) - 29);
        const monthKey = format(monthStart, 'MMM yyyy', { locale: es });

        const createdTasks = tasks.filter(task => {
          if (!task.created_at) return false;
          const taskDate = new Date(task.created_at);
          return isWithinInterval(taskDate, { start: monthEnd, end: monthStart });
        }).length;

        const completedTasks = tasks.filter(task => {
          if (task.status !== 'completed') return false;
          const taskDate = new Date(task.updated_at);
          return isWithinInterval(taskDate, { start: monthEnd, end: monthStart });
        }).length;

        data.push({
          date: monthKey,
          creadas: createdTasks,
          completadas: completedTasks,
          fullDate: format(monthStart, 'yyyy-MM-dd'),
        });
      }
    }

    return data;
  };

  const chartData = useMemo(() => generateChartData(), [tasks, timeframe, period]);
  
  const totalCreated = tasks.length;
  const totalCompleted = tasks.filter(task => task.status === 'completed').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tendencia de Tareas</span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>Total Creadas: {totalCreated}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span>Total Completadas: {totalCompleted}</span>
            </div>
          </div>
        </CardTitle>
        
        {/* Controles de filtro */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Agrupar por:</span>
            <Select value={timeframe} onValueChange={(value: Timeframe) => setTimeframe(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Período:</span>
            <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Última semana</SelectItem>
                <SelectItem value="15days">Últimos 15 días</SelectItem>
                <SelectItem value="30days">Últimos 30 días</SelectItem>
                <SelectItem value="all">Todo el período</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={timeframe === 'daily' ? 2 : 0}
              angle={timeframe === 'daily' ? -45 : 0}
              textAnchor={timeframe === 'daily' ? 'end' : 'middle'}
              height={timeframe === 'daily' ? 60 : 30}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                      <p className="font-medium text-gray-900">{label}</p>
                      {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="creadas"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              name="Tareas Creadas"
            />
            <Line
              type="monotone"
              dataKey="completadas"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              name="Tareas Completadas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
