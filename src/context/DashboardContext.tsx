import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext({
  widgets: {
    recentTasks: true,
    taskDistribution: true,
    clientDistribution: true,
    platformUsage: true,
  },
  toggleWidget: (widget: string) => {},
});

export const DashboardProvider = ({ children }) => {
  const [widgets, setWidgets] = useState({
    recentTasks: true,
    taskDistribution: true,
    clientDistribution: true,
    platformUsage: true,
  });

  const toggleWidget = (widget) => {
    setWidgets((prev) => ({ ...prev, [widget]: !prev[widget] }));
  };

  return (
    <DashboardContext.Provider value={{ widgets, toggleWidget }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);