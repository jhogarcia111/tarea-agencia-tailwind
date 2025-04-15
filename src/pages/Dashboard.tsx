import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TaskDistributionChart } from "@/components/dashboard/TaskDistributionChart";
import { RecentTasks } from "@/components/dashboard/RecentTasks";
import { ClientDistributionChart } from "@/components/dashboard/ClientDistributionChart";
import { PlatformUsageChart } from "@/components/dashboard/PlatformUsageChart";
import { UserTaskCharts } from "@/components/dashboard/UserTaskCharts";
import { UserComparisonChart } from "@/components/dashboard/PlatformUsageChart";
import { TaskDeadlineCalendar } from "@/components/ui/calendar";
import { TaskStateChart } from "@/components/ui/TaskStateChart";
import { useData } from "@/context/DataContext";
import { Users, Briefcase, CheckSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export interface Task {
  id: number; // Align with DataContext
  title: string;
  status: string;
  dueDate: string;
}

interface TaskTableProps {
  tasks: Task[]; // Ensure tasks prop is properly typed
}

export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Task Title</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Due Date</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td className="border border-gray-300 px-4 py-2">{task.title}</td>
            <td className="border border-gray-300 px-4 py-2">{task.status}</td>
            <td className="border border-gray-300 px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Dashboard() {
  const { auth, users, clients, tasks, activityLogs } = useData();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (!selectedDate) return true;
    const taskDate = new Date(task.dueDate).toDateString();
    return taskDate === selectedDate.toDateString();
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // Count completed tasks
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  
  // Count pending tasks
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  
  // Get today's activity count
  const todayActivities = activityLogs.filter(log => {
    const logDate = new Date(log.date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return logDate === today;
  }).length;

  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido, {auth.currentUser?.name} ({auth.currentUser?.role})
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/users"
            className="flex items-center justify-center rounded-lg bg-blue-500 p-6 text-white transition-all hover:bg-blue-600"
          >
            <StatsCard
              title="Usuarios"
              value={users.length}
              icon={<Users className="h-5 w-5 text-brand-500" />}
              description={`${users.filter(u => u.status === 'active').length} activos`}
              trend={{ value: 25, positive: true }}
            />
          </Link>
          <Link
            to="/clients"
            className="flex items-center justify-center rounded-lg bg-green-500 p-6 text-white transition-all hover:bg-green-600"
          >
            <StatsCard
              title="Clientes"
              value={clients.length}
              icon={<Briefcase className="h-5 w-5 text-brand-500" />}
              description={`${clients.filter(c => c.status === 'active').length} activos`}
              trend={{ value: 10, positive: true }}
            />
          </Link>
          <Link
            to="/tasks"
            className="flex items-center justify-center rounded-lg bg-yellow-500 p-6 text-white transition-all hover:bg-yellow-600"
          >
            <StatsCard
              title="Tareas Activas"
              value={tasks.length}
              icon={<CheckSquare className="h-5 w-5 text-brand-500" />}
              description={`${completedTasks} completadas`}
            />
          </Link>
          <Link
            to="/pending"
            className="flex items-center justify-center rounded-lg bg-red-500 p-6 text-white transition-all hover:bg-red-600"
          >
            <StatsCard
              title="Pendientes"
              value={pendingTasks}
              icon={<Clock className="h-5 w-5 text-brand-500" />}
              description={`${todayActivities} actividades hoy`}
              trend={{ value: 5, positive: false }}
            />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TaskDistributionChart />
          <ClientDistributionChart />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TaskDeadlineCalendar onDateClick={handleDateClick} />
          <TaskStateChart />
        </div>

        {selectedDate && (
          <div>
            <h2 className="text-xl font-bold">Tareas para {selectedDate.toDateString()}</h2>
            <TaskTable tasks={filteredTasks} />
          </div>
        )}

        <UserTaskCharts />

        <div className="grid gap-6 md:grid-cols-2">
          <PlatformUsageChart />
          <UserComparisonChart />
        </div>

        <RecentTasks />
      </div>
    </MainLayout>
  );
}
