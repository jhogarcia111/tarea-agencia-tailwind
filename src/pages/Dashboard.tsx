
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TaskDistributionChart } from "@/components/dashboard/TaskDistributionChart";
import { RecentTasks } from "@/components/dashboard/RecentTasks";
import { ClientDistributionChart } from "@/components/dashboard/ClientDistributionChart";
import { Users, Briefcase, CheckSquare, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido al panel de administración de tu agencia de marketing
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Usuarios"
            value="5"
            icon={<Users className="h-5 w-5 text-brand-500" />}
            description="1 nuevo esta semana"
            trend={{ value: 25, positive: true }}
          />
          <StatsCard
            title="Clientes"
            value="12"
            icon={<Briefcase className="h-5 w-5 text-brand-500" />}
            description="2 nuevos este mes"
            trend={{ value: 10, positive: true }}
          />
          <StatsCard
            title="Tareas Activas"
            value="49"
            icon={<CheckSquare className="h-5 w-5 text-brand-500" />}
            description="8 completadas hoy"
          />
          <StatsCard
            title="Pendientes"
            value="15"
            icon={<Clock className="h-5 w-5 text-brand-500" />}
            description="4 con fecha próxima"
            trend={{ value: 5, positive: false }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TaskDistributionChart />
          <ClientDistributionChart />
        </div>

        <RecentTasks />
      </div>
    </MainLayout>
  );
}
