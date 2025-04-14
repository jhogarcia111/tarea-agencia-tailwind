
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our data
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar: string;
}

export interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  status: 'active' | 'inactive';
  taskCount: number;
  industry: string;
}

export interface Task {
  id: number;
  title: string;
  client: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
}

interface DataContextType {
  users: User[];
  clients: Client[];
  tasks: Task[];
  addUser: (user: Omit<User, 'id' | 'avatar'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
  addClient: (client: Omit<Client, 'id' | 'taskCount'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: number) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  getUserById: (id: number) => User | undefined;
  getClientById: (id: number) => Client | undefined;
  getTaskById: (id: number) => Task | undefined;
  getTasksByClient: (clientName: string) => Task[];
  getTasksByAssignee: (userName: string) => Task[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialUsers: User[] = [
  {
    id: 1,
    name: "María López",
    email: "maria@agencia.com",
    role: "admin",
    status: "active",
    avatar: "ML",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos@agencia.com",
    role: "designer",
    status: "active",
    avatar: "CR",
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana@agencia.com",
    role: "marketing",
    status: "active",
    avatar: "AM",
  },
  {
    id: 4,
    name: "Juan Pérez",
    email: "juan@agencia.com",
    role: "copywriter",
    status: "inactive",
    avatar: "JP",
  },
  {
    id: 5,
    name: "Laura Sánchez",
    email: "laura@agencia.com",
    role: "manager",
    status: "active",
    avatar: "LS",
  },
];

const initialClients: Client[] = [
  {
    id: 1,
    name: "Acme Inc.",
    contact: "John Smith",
    email: "john@acme.com",
    status: "active",
    taskCount: 15,
    industry: "Retail",
  },
  {
    id: 2,
    name: "TechCorp",
    contact: "Emma Johnson",
    email: "emma@techcorp.com",
    status: "active",
    taskCount: 8,
    industry: "Technology",
  },
  {
    id: 3,
    name: "Globex",
    contact: "Michael Brown",
    email: "michael@globex.com",
    status: "active",
    taskCount: 12,
    industry: "Finance",
  },
  {
    id: 4,
    name: "Smith & Co",
    contact: "Sarah Williams",
    email: "sarah@smithco.com",
    status: "inactive",
    taskCount: 5,
    industry: "Healthcare",
  },
  {
    id: 5,
    name: "Initech",
    contact: "David Miller",
    email: "david@initech.com",
    status: "active",
    taskCount: 9,
    industry: "Manufacturing",
  },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Diseñar banner para campaña de Facebook",
    client: "Acme Inc.",
    assignee: "María López",
    status: "completed",
    dueDate: "2025-04-10",
    priority: "high",
  },
  {
    id: 2,
    title: "Crear copy para publicación de Instagram",
    client: "TechCorp",
    assignee: "Carlos Rodríguez",
    status: "in-progress",
    dueDate: "2025-04-15",
    priority: "medium",
  },
  {
    id: 3,
    title: "Análisis de rendimiento de campaña",
    client: "Globex",
    assignee: "Ana Martínez",
    status: "pending",
    dueDate: "2025-04-20",
    priority: "medium",
  },
  {
    id: 4,
    title: "Optimizar palabras clave para SEO",
    client: "Smith & Co",
    assignee: "Juan Pérez",
    status: "in-progress",
    dueDate: "2025-04-16",
    priority: "high",
  },
  {
    id: 5,
    title: "Revisión de contenido del blog",
    client: "Acme Inc.",
    assignee: "María López",
    status: "pending",
    dueDate: "2025-04-25",
    priority: "low",
  },
  {
    id: 6,
    title: "Actualizar página de contacto",
    client: "TechCorp",
    assignee: "Carlos Rodríguez",
    status: "pending",
    dueDate: "2025-04-30",
    priority: "low",
  },
  {
    id: 7,
    title: "Preparar informe mensual",
    client: "Globex",
    assignee: "Ana Martínez",
    status: "in-progress",
    dueDate: "2025-04-28",
    priority: "high",
  },
  {
    id: 8,
    title: "Diseño de newsletter",
    client: "Initech",
    assignee: "Laura Sánchez",
    status: "completed",
    dueDate: "2025-04-05",
    priority: "medium",
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage if available
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : initialClients;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addUser = (user: Omit<User, 'id' | 'avatar'>) => {
    const newUser: User = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      avatar: user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const addClient = (client: Omit<Client, 'id' | 'taskCount'>) => {
    const newClient: Client = {
      ...client,
      id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
      taskCount: 0,
    };
    setClients([...clients, newClient]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client));
  };

  const deleteClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
    // Also delete all tasks associated with this client
    const clientToDelete = clients.find(c => c.id === id);
    if (clientToDelete) {
      setTasks(tasks.filter(task => task.client !== clientToDelete.name));
    }
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    };
    setTasks([...tasks, newTask]);
    
    // Update client taskCount
    const clientIndex = clients.findIndex(c => c.name === task.client);
    if (clientIndex !== -1) {
      const updatedClient = {
        ...clients[clientIndex],
        taskCount: clients[clientIndex].taskCount + 1
      };
      updateClient(updatedClient);
    }
  };

  const updateTask = (updatedTask: Task) => {
    const oldTask = tasks.find(t => t.id === updatedTask.id);
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    
    // Update client taskCount if client changed
    if (oldTask && oldTask.client !== updatedTask.client) {
      // Decrease count for old client
      const oldClientIndex = clients.findIndex(c => c.name === oldTask.client);
      if (oldClientIndex !== -1) {
        const oldClientUpdated = {
          ...clients[oldClientIndex],
          taskCount: Math.max(0, clients[oldClientIndex].taskCount - 1)
        };
        updateClient(oldClientUpdated);
      }
      
      // Increase count for new client
      const newClientIndex = clients.findIndex(c => c.name === updatedTask.client);
      if (newClientIndex !== -1) {
        const newClientUpdated = {
          ...clients[newClientIndex],
          taskCount: clients[newClientIndex].taskCount + 1
        };
        updateClient(newClientUpdated);
      }
    }
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    
    // Update client taskCount
    if (taskToDelete) {
      const clientIndex = clients.findIndex(c => c.name === taskToDelete.client);
      if (clientIndex !== -1) {
        const updatedClient = {
          ...clients[clientIndex],
          taskCount: Math.max(0, clients[clientIndex].taskCount - 1)
        };
        updateClient(updatedClient);
      }
    }
  };

  const getUserById = (id: number) => users.find(user => user.id === id);
  const getClientById = (id: number) => clients.find(client => client.id === id);
  const getTaskById = (id: number) => tasks.find(task => task.id === id);
  const getTasksByClient = (clientName: string) => tasks.filter(task => task.client === clientName);
  const getTasksByAssignee = (userName: string) => tasks.filter(task => task.assignee === userName);

  return (
    <DataContext.Provider
      value={{
        users,
        clients,
        tasks,
        addUser,
        updateUser,
        deleteUser,
        addClient,
        updateClient,
        deleteClient,
        addTask,
        updateTask,
        deleteTask,
        getUserById,
        getClientById,
        getTaskById,
        getTasksByClient,
        getTasksByAssignee
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
