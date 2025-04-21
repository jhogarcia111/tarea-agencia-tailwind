import React, { useState } from 'react';

const TaskTable = ({ tasks }) => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueDate: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (filters.status ? task.status === filters.status : true) &&
      (filters.priority ? task.priority === filters.priority : true) &&
      (filters.dueDate ? task.dueDate === filters.dueDate : true)
    );
  });

  return (
    <div>
      <div className="filters">
        <select name="status" onChange={handleFilterChange} value={filters.status}>
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="in-progress">En progreso</option>
          <option value="completed">Completado</option>
        </select>

        <select name="priority" onChange={handleFilterChange} value={filters.priority}>
          <option value="">Todas las prioridades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>

        <input
          type="date"
          name="dueDate"
          onChange={handleFilterChange}
          value={filters.dueDate}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Fecha de vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>{task.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;