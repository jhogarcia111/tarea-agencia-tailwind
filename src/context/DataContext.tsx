import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";


// Define types for our data
export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // Added password field
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
  createdDate: string; // New field for creation date
}

export interface ErrorLog {
  id: number;
  userId: number | null;
  userRole: string | null;
  location: string;
  form: string | null;
  message: string;
  date: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  location: string;
  date: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
}

interface DataContextType {
  // Auth state
  auth: AuthState;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  // Original data management
  users: User[];
  clients: Client[];
  tasks: Task[];
  
  // Error and activity logs
  errorLogs: ErrorLog[];
  activityLogs: ActivityLog[];
  
  // Add error log
  logError: (error: Omit<ErrorLog, 'id' | 'date' | 'userId' | 'userRole'>) => void;
  
  // Original CRUD operations
  addUser: (user: Omit<User, 'id' | 'avatar'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
  addClient: (client: Omit<Client, 'id' | 'taskCount'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: number) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  
  // Getters
  getUserById: (id: number) => User | undefined;
  getClientById: (id: number) => Client | undefined;
  getTaskById: (id: number) => Task | undefined;
  getTasksByClient: (clientName: string) => Task[];
  getTasksByAssignee: (userName: string) => Task[];
  
  // Activity tracking
  getDailyActivityCount: () => { date: string; count: number }[];
  getUserActivityCounts: () => { user: string; count: number }[];

  // Password recovery
  sendPasswordRecoveryEmail: (email: string) => { success: boolean; message: string };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialErrorLogs: ErrorLog[] = [];
const initialActivityLogs: ActivityLog[] = [];

export const getClients = async (): Promise<Client[]> => {
  // Ensure this function returns a Promise<Client[]>
  return [
    // Example mock data
    { id: 1, name: "Client A", contact: "123456789", email: "clienta@example.com", status: "active", taskCount: 0, industry: "Tech" },
    { id: 2, name: "Client B", contact: "987654321", email: "clientb@example.com", status: "inactive", taskCount: 2, industry: "Finance" }
  ];
};

export const getUsers = async (): Promise<User[]> => {
  // Ensure this function returns a Promise<User[]>
  return [
    // Example mock data
    { id: 1, name: "John Doe", email: "john@example.com", password: "123456", role: "admin", status: "active", avatar: "JD" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", password: "password", role: "user", status: "inactive", avatar: "JS" }
  ];
};

const fetchLocalTasks = async (): Promise<Task[]> => {
  // Example mock data
  return [
    { id: 1, title: "Task 1", client: "Client A", assignee: "John Doe", status: "pending", dueDate: "2023-12-01", priority: "high", createdDate: "2023-11-01" },
    { id: 2, title: "Task 2", client: "Client B", assignee: "Jane Smith", status: "in-progress", dueDate: "2023-12-05", priority: "medium", createdDate: "2023-11-02" }
  ];
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage if available
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>(() => {
    const savedErrorLogs = localStorage.getItem('errorLogs');
    return savedErrorLogs ? JSON.parse(savedErrorLogs) : initialErrorLogs;
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const savedActivityLogs = localStorage.getItem('activityLogs');
    return savedActivityLogs ? JSON.parse(savedActivityLogs) : initialActivityLogs;
  });
  
  // Auth state
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : { isLoggedIn: false, currentUser: null };
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await getUsers();
      const fetchedClients = await getClients();
      const fetchedTasks = await fetchLocalTasks();
      setUsers(fetchedUsers);
      setClients(fetchedClients);
      setTasks(fetchedTasks);
    };
    fetchData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('errorLogs', JSON.stringify(errorLogs));
  }, [errorLogs]);
  
  useEffect(() => {
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
  }, [activityLogs]);
  
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const [rows] = await connection.query(
        'SELECT id, name, email, status FROM Users WHERE email = ? AND password = ?',
        [email, password]
      ) as any[];

      if (rows.length > 0) {
        const user = rows[0];

        if (user.status === 'inactive') {
          logError({
            location: 'Login Page',
            form: 'Login Form',
            message: `Intento de acceso con cuenta inactiva: ${email}`,
          });
          return {
            success: false,
            message: 'Esta cuenta está inactiva. Por favor, contacte al administrador.',
          };
        }

        const updatedAuth = { isLoggedIn: true, currentUser: user };
        setAuth(updatedAuth);

        logActivity(user.id, user.name, 'Inicio de sesión', 'Login');

        return { success: true, message: 'Inicio de sesión exitoso' };
      } else {
        logError({
          location: 'Login Page',
          form: 'Login Form',
          message: `Intento de acceso fallido para el usuario: ${email}`,
        });
        return { success: false, message: 'Usuario o contraseña incorrectos.' };
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      logError({
        location: 'Login Page',
        form: 'Login Form',
        message: 'Error interno del servidor durante el inicio de sesión.',
      });
      return { success: false, message: 'Error interno del servidor. Por favor, intente más tarde.' };
    }
  };
  
  // Logout function
  const logout = () => {
    if (auth.currentUser) {
      logActivity(auth.currentUser.id, auth.currentUser.name, "Cierre de sesión", "Logout");
    }
    setAuth({ isLoggedIn: false, currentUser: null });
  };

  // Log error
  const logError = (error: Omit<ErrorLog, 'id' | 'date' | 'userId' | 'userRole'>) => {
    const newError: ErrorLog = {
      ...error,
      id: errorLogs.length > 0 ? Math.max(...errorLogs.map(e => e.id)) + 1 : 1,
      userId: auth.currentUser?.id || null,
      userRole: auth.currentUser?.role || null,
      date: new Date().toISOString(),
    };
    setErrorLogs([...errorLogs, newError]);
  };
  
  // Log activity
  const logActivity = (userId: number, userName: string, action: string, location: string) => {
    const newActivity: ActivityLog = {
      id: activityLogs.length > 0 ? Math.max(...activityLogs.map(a => a.id)) + 1 : 1,
      userId,
      userName,
      action,
      location,
      date: new Date().toISOString(),
    };
    setActivityLogs([...activityLogs, newActivity]);
  };
  
  // Wrap CRUD operations to log activities
  const addUser = (user: Omit<User, 'id' | 'avatar'>) => {
    const newUser: User = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      avatar: user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    };
    setUsers([...users, newUser]);
    
    if (auth.currentUser) {
      logActivity(auth.currentUser.id, auth.currentUser.name, "Agregó nuevo usuario: " + newUser.name, "Usuarios");
    }
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    
    if (auth.currentUser) {
      logActivity(auth.currentUser.id, auth.currentUser.name, "Actualizó usuario: " + updatedUser.name, "Usuarios");
    }
  };

  const deleteUser = (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    setUsers(users.filter(user => user.id !== id));
    
    if (auth.currentUser && userToDelete) {
      logActivity(auth.currentUser.id, auth.currentUser.name, "Eliminó usuario: " + userToDelete.name, "Usuarios");
    }
  };

  const addClient = (client: Omit<Client, 'id' | 'taskCount'>) => {
    const newClient: Client = {
      ...client,
      id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
      taskCount: 0,
    };
    setClients([...clients, newClient]);
    
    if (auth.currentUser) {
      logActivity(auth.currentUser.id, auth.currentUser.name, "Agregó nuevo cliente: " + newClient.name, "Clientes");
    }
  };

  const updateClient = (updatedClient: Client) => {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client));
    
    if (auth.currentUser) {
      logActivity(auth.currentUser.id, auth.currentUser.name, "Actualizó cliente: " + updatedClient.name, "Clientes");
    }
  };

  const deleteClient = (id: number) => {
    const clientToDelete = clients.find(c => c.id === id);
    setClients(clients.filter(client => client.id !== id));
    
    // Also delete all tasks associated with this client
    if (clientToDelete) {
      const clientTasks = tasks.filter(task => task.client === clientToDelete.name);
      setTasks(tasks.filter(task => task.client !== clientToDelete.name));
      
      if (auth.currentUser) {
        logActivity(
          auth.currentUser.id, 
          auth.currentUser.name, 
          `Eliminó cliente: ${clientToDelete.name} y ${clientTasks.length} tareas asociadas`, 
          "Clientes"
        );
      }
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'createdDate'>) => {
    const newTask: Task = {
      ...task,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      createdDate: new Date().toISOString().split('T')[0], // Set creation date to today
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
    
    if (auth.currentUser) {
      logActivity(auth.currentUser.id, auth.currentUser.name, "Agregó nueva tarea: " + newTask.title, "Tareas");
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
    
    if (auth.currentUser) {
      logActivity(auth.currentUser.id, auth.currentUser.name, "Actualizó tarea: " + updatedTask.title, "Tareas");
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
      
      if (auth.currentUser) {
        logActivity(auth.currentUser.id, auth.currentUser.name, "Eliminó tarea: " + taskToDelete.title, "Tareas");
      }
    }
  };
  
  // Get daily activity count for the chart
  const getDailyActivityCount = () => {
    const counts: { [key: string]: number } = {};
    
    // Group activities by date (only the day part)
    activityLogs.forEach(log => {
      const date = new Date(log.date).toISOString().split('T')[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    
    // Convert to array format for the chart
    const result = Object.keys(counts).map(date => ({
      date,
      count: counts[date]
    }));
    
    // Sort by date
    return result.sort((a, b) => a.date.localeCompare(b.date));
  };

  const getUserActivityCounts = () => {
    const counts: { [key: string]: number } = {};

    activityLogs.forEach(log => {
      counts[log.userName] = (counts[log.userName] || 0) + 1;
    });

    return Object.keys(counts).map(user => ({
      user,
      count: counts[user]
    }));
  };

  const getUserById = (id: number) => users.find(user => user.id === id);
  const getClientById = (id: number) => clients.find(client => client.id === id);
  const getTaskById = (id: number) => tasks.find(task => task.id === id);
  const getTasksByClient = (clientName: string) => tasks.filter(task => task.client === clientName);
  const getTasksByAssignee = (userName: string) => tasks.filter(task => task.assignee === userName);

  const sendPasswordRecoveryEmail = (email: string) => {
    const user = users.find(u => u.email === email);

    if (!user) {
      logError({
        location: "Forgot Password",
        form: "Password Recovery",
        message: `Intento de recuperación para un correo no registrado: ${email}`
      });
      return { success: false, message: "Correo no registrado. Por favor, contacte al administrador." };
    }

    // Simulate sending an email
    console.log(`Enviando correo a ${email} con la contraseña: ${user.password}`);
    toast.success(`Correo enviado a ${email}`);

    return { success: true, message: "Correo enviado con éxito." };
  };

  return (
    <DataContext.Provider
      value={{
        auth,
        login,
        logout,
        users,
        clients,
        tasks,
        errorLogs,
        activityLogs,
        logError,
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
        getTasksByAssignee,
        getDailyActivityCount,
        getUserActivityCounts,
        sendPasswordRecoveryEmail
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

