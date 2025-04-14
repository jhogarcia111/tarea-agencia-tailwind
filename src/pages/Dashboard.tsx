
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TaskDistributionChart } from "@/components/dashboard/TaskDistributionChart";
import { RecentTasks } from "@/components/dashboard/RecentTasks";
import { ClientDistributionChart } from "@/components/dashboard/ClientDistributionChart";
import { PlatformUsageChart } from "@/components/dashboard/PlatformUsageChart";
import { useData } from "@/context/DataContext";
import { Users, Briefcase, CheckSquare, Clock } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { auth, users, clients, tasks, activityLogs } = useData();

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
          <StatsCard
            title="Usuarios"
            value={users.length}
            icon={<Users className="h-5 w-5 text-brand-500" />}
            description={`${users.filter(u => u.status === 'active').length} activos`}
            trend={{ value: 25, positive: true }}
          />
          <StatsCard
            title="Clientes"
            value={clients.length}
            icon={<Briefcase className="h-5 w-5 text-brand-500" />}
            description={`${clients.filter(c => c.status === 'active').length} activos`}
            trend={{ value: 10, positive: true }}
          />
          <StatsCard
            title="Tareas Activas"
            value={tasks.length}
            icon={<CheckSquare className="h-5 w-5 text-brand-500" />}
            description={`${completedTasks} completadas`}
          />
          <StatsCard
            title="Pendientes"
            value={pendingTasks}
            icon={<Clock className="h-5 w-5 text-brand-500" />}
            description={`${todayActivities} actividades hoy`}
            trend={{ value: 5, positive: false }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TaskDistributionChart />
          <ClientDistributionChart />
        </div>

        <PlatformUsageChart />

        <RecentTasks />
      </div>
    </MainLayout>
  );
}
