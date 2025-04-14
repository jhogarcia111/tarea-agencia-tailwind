import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";

export function UserTaskCharts() {
  const { tasks, users } = useData();
  const navigate = useNavigate();

  // Process data for tasks assigned daily
  const assignedData = users.map(user => {
    const userTasks = tasks.filter(task => task.assignee === user.name);
    const dailyCounts = {};

    userTasks.forEach(task => {
      const date = new Date(task.dueDate).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return {
      name: user.name,
      data: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
    };
  });

  // Process data for tasks completed daily
  const completedData = users.map(user => {
    const userTasks = tasks.filter(task => task.assignee === user.name && task.status === "completed");
    const dailyCounts = {};

    userTasks.forEach(task => {
      const date = new Date(task.dueDate).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return {
      name: user.name,
      data: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
    };
  });

  const handleClick = (userName) => {
    navigate(`/tasks?assignee=${userName}`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-xl font-bold mb-4">Tareas Asignadas por Día</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {assignedData.map(user => (
              <Line
                key={user.name}
                type="monotone"
                dataKey="count"
                data={user.data}
                name={user.name}
                stroke="#8884d8"
                onClick={() => handleClick(user.name)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Tareas Completadas por Día</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {completedData.map(user => (
              <Line
                key={user.name}
                type="monotone"
                dataKey="count"
                data={user.data}
                name={user.name}
                stroke="#82ca9d"
                onClick={() => handleClick(user.name)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}