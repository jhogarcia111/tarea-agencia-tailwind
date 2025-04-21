import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const DashboardSettings = () => {
  const { widgets, toggleWidget } = useDashboard();

  return (
    <div className="dashboard-settings">
      <h2>Configurar Dashboard</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={widgets.recentTasks}
            onChange={() => toggleWidget('recentTasks')}
          />
          Tareas Recientes
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={widgets.taskDistribution}
            onChange={() => toggleWidget('taskDistribution')}
          />
          Distribución de Tareas
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={widgets.clientDistribution}
            onChange={() => toggleWidget('clientDistribution')}
          />
          Distribución de Clientes
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={widgets.platformUsage}
            onChange={() => toggleWidget('platformUsage')}
          />
          Uso de la Plataforma
        </label>
      </div>
    </div>
  );
};

export default DashboardSettings;