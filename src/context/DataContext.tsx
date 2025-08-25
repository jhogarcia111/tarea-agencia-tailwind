import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  profileService, 
  clientService, 
  taskService, 
  activityLogService, 
  errorLogService, 
  changeLogService, 
  authService,
  type Profile,
  type Client,
  type Task,
  type ActivityLog,
  type ErrorLog,
  type ChangeLog
} from '@/services/supabaseService';

// Re-export types from service
export type { Profile, Client, Task, ActivityLog, ErrorLog, ChangeLog };

// Legacy type aliases for backward compatibility
export type User = Profile;

export interface AuthState {
  isAuthenticated: boolean;
  user: Profile | null;
  session: any;
  // Legacy properties for backward compatibility
  isLoggedIn: boolean;
  currentUser: Profile | null;
}

interface DataContextType {
  // Auth
  auth: AuthState;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  
  // Data
  users: Profile[];
  clients: Client[];
  tasks: Task[];
  errorLogs: ErrorLog[];
  activityLogs: ActivityLog[];
  changeLogs: ChangeLog[];
  
  // Loading states
  loading: boolean;
  
  // Add error log
  logError: (error: Omit<ErrorLog, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  
  // CRUD operations
  addUser: (user: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateUser: (user: Profile) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'task_count' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_date' | 'created_at' | 'updated_at' | 'assignee' | 'client'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Utility functions
  getUserById: (id: string) => Profile | undefined;
  getClientById: (id: string) => Client | undefined;
  getTaskById: (id: string) => Task | undefined;
  getTasksByClient: (clientName: string) => Task[];
  getTasksByAssignee: (userName: string) => Task[];
  
  // Activity tracking
  getDailyActivityCount: () => { date: string; count: number }[];
  getUserActivityCounts: () => { user: string; count: number }[];

  // Password recovery
  sendPasswordRecoveryEmail: (email: string) => { success: boolean; message: string };
  
  // Refresh data
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Legacy notification context for backward compatibility
export const NotificationContext = createContext({ notifications: [] });

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotificationContext.Provider value={{ notifications: [] }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [users, setUsers] = useState<Profile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Auth state with backward compatibility
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    session: null,
    isLoggedIn: false,
    currentUser: null
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          const user = await profileService.getCurrentUser();
          setAuth({
            isAuthenticated: true,
            user,
            session,
            isLoggedIn: true,
            currentUser: user
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          const user = await profileService.getCurrentUser();
          setAuth({
            isAuthenticated: true,
            user,
            session,
            isLoggedIn: true,
            currentUser: user
          });
          await refreshData();
        } catch (error) {
          console.error('Error getting user profile:', error);
          setAuth({
            isAuthenticated: false,
            user: null,
            session: null,
            isLoggedIn: false,
            currentUser: null
          });
        }
      } else {
        setAuth({
          isAuthenticated: false,
          user: null,
          session: null,
          isLoggedIn: false,
          currentUser: null
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      refreshData();
    }
  }, [auth.isAuthenticated]);

  // Refresh all data
  const refreshData = async () => {
    if (!auth.isAuthenticated) return;
    
    setLoading(true);
    try {
      const [
        usersData,
        clientsData,
        tasksData,
        errorLogsData,
        activityLogsData,
        changeLogsData
      ] = await Promise.all([
        profileService.getAll(),
        clientService.getAll(),
        taskService.getAll(),
        errorLogService.getAll(),
        activityLogService.getAll(),
        changeLogService.getAll()
      ]);

      setUsers(usersData);
      setClients(clientsData);
      setTasks(tasksData);
      setErrorLogs(errorLogsData);
      setActivityLogs(activityLogsData);
      setChangeLogs(changeLogsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Auth functions
  const login = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      console.error('Login error:', error);
      await logError({
        location: 'Login Page',
        form_name: 'Login Form',
        message: `Login failed: ${error.message}`,
        user_role: null
      });
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await authService.signUp(email, password, name);
      return { 
        success: true, 
        message: 'Account created successfully. Please check your email for verification.' 
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      await logError({
        location: 'Sign Up Page',
        form_name: 'Sign Up Form',
        message: `Sign up failed: ${error.message}`,
        user_role: null
      });
      return { 
        success: false, 
        message: error.message || 'Sign up failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      if (auth.user) {
        await logActivity(auth.user.name, 'Logged out', 'Authentication');
      }
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Logging functions
  const logError = async (error: Omit<ErrorLog, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const newError = {
        ...error,
        user_id: auth.user?.id || null
      };
      await errorLogService.create(newError);
      await refreshData(); // Refresh to get updated logs
    } catch (err) {
      console.error('Error logging error:', err);
    }
  };

  const logActivity = async (user_name: string, action: string, details?: string) => {
    try {
      const newActivity = {
        user_id: auth.user?.id || null,
        user_name,
        action,
        details
      };
      await activityLogService.create(newActivity);
      await refreshData(); // Refresh to get updated logs
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const logChange = async (entity_type: 'user' | 'client' | 'task', entity_id: string, action: 'create' | 'update' | 'delete', changes?: any) => {
    if (!auth.user) return;
    
    try {
      const newChange = {
        user_id: auth.user.id,
        user_name: auth.user.name,
        entity_type,
        entity_id,
        action,
        changes
      };
      await changeLogService.create(newChange);
      await refreshData(); // Refresh to get updated logs
    } catch (error) {
      console.error('Error logging change:', error);
    }
  };

  // CRUD operations
  const addUser = async (user: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Note: In a real implementation, you'd need to create users via auth.signUp
      toast.error('User creation should be handled via sign up process');
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      await logError({
        location: 'Users Page',
        form_name: 'Add User Form',
        message: `Failed to add user: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  const updateUser = async (updatedUser: Profile) => {
    try {
      await profileService.update(updatedUser.id, updatedUser);
      await logActivity(auth.user?.name || 'System', `Updated user: ${updatedUser.name}`);
      await logChange('user', updatedUser.id, 'update');
      await refreshData();
      toast.success('User updated successfully');
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      await logError({
        location: 'Users Page',
        form_name: 'Edit User Form',
        message: `Failed to update user: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      // Note: Cannot delete profiles directly, only deactivate
      if (user) {
        await profileService.update(id, { ...user, status: 'inactive' });
        await logActivity(auth.user?.name || 'System', `Deactivated user: ${user.name}`);
        await logChange('user', id, 'delete');
        await refreshData();
        toast.success('User deactivated successfully');
      }
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user');
      await logError({
        location: 'Users Page',
        message: `Failed to deactivate user: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'task_count' | 'created_at' | 'updated_at'>) => {
    try {
      await clientService.create(client);
      await logActivity(auth.user?.name || 'System', `Added new client: ${client.name}`);
      await refreshData();
      toast.success('Client added successfully');
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
      await logError({
        location: 'Clients Page',
        form_name: 'Add Client Form',
        message: `Failed to add client: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  const updateClient = async (updatedClient: Client) => {
    try {
      await clientService.update(updatedClient.id, updatedClient);
      await logActivity(auth.user?.name || 'System', `Updated client: ${updatedClient.name}`);
      await logChange('client', updatedClient.id, 'update');
      await refreshData();
      toast.success('Client updated successfully');
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      await logError({
        location: 'Clients Page',
        form_name: 'Edit Client Form',
        message: `Failed to update client: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const client = clients.find(c => c.id === id);
      await clientService.delete(id);
      if (client) {
        await logActivity(auth.user?.name || 'System', `Deleted client: ${client.name}`);
        await logChange('client', id, 'delete');
      }
      await refreshData();
      toast.success('Client deleted successfully');
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
      await logError({
        location: 'Clients Page',
        message: `Failed to delete client: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'created_date' | 'created_at' | 'updated_at' | 'assignee' | 'client'>) => {
    try {
      const newTask = {
        ...task,
        created_date: new Date().toISOString()
      };
      await taskService.create(newTask);
      await logActivity(auth.user?.name || 'System', `Added new task: ${task.title}`);
      await refreshData();
      toast.success('Task added successfully');
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      await logError({
        location: 'Tasks Page',
        form_name: 'Add Task Form',
        message: `Failed to add task: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      await taskService.update(updatedTask.id, updatedTask);
      await logActivity(auth.user?.name || 'System', `Updated task: ${updatedTask.title}`);
      await logChange('task', updatedTask.id, 'update');
      await refreshData();
      toast.success('Task updated successfully');
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      await logError({
        location: 'Tasks Page',
        form_name: 'Edit Task Form',
        message: `Failed to update task: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      await taskService.delete(id);
      if (task) {
        await logActivity(auth.user?.name || 'System', `Deleted task: ${task.title}`);
        await logChange('task', id, 'delete');
      }
      await refreshData();
      toast.success('Task deleted successfully');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      await logError({
        location: 'Tasks Page',
        message: `Failed to delete task: ${error.message}`,
        user_role: auth.user?.role || null
      });
    }
  };

  // Utility functions
  const getUserById = (id: string) => users.find(u => u.id === id);
  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getTaskById = (id: string) => tasks.find(t => t.id === id);
  
  const getTasksByClient = (clientName: string) => 
    tasks.filter(task => task.client?.name === clientName);
  
  const getTasksByAssignee = (userName: string) => 
    tasks.filter(task => task.assignee?.name === userName);

  // Activity tracking
  const getDailyActivityCount = () => {
    const counts: { [key: string]: number } = {};
    
    activityLogs.forEach(log => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    
    return Object.keys(counts).map(date => ({
      date,
      count: counts[date]
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  const getUserActivityCounts = () => {
    const counts: { [key: string]: number } = {};
    
    activityLogs.forEach(log => {
      counts[log.user_name] = (counts[log.user_name] || 0) + 1;
    });
    
    return Object.keys(counts).map(user => ({
      user,
      count: counts[user]
    })).sort((a, b) => b.count - a.count);
  };

  // Password recovery (mock implementation)
  const sendPasswordRecoveryEmail = (email: string) => {
    // In a real implementation, this would send an actual email
    return {
      success: true,
      message: 'Password recovery email sent. Please check your inbox.'
    };
  };

  const contextValue: DataContextType = {
    auth,
    login,
    logout,
    signUp,
    users,
    clients,
    tasks,
    errorLogs,
    activityLogs,
    changeLogs,
    loading,
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
    sendPasswordRecoveryEmail,
    refreshData
  };

  return (
    <DataContext.Provider value={contextValue}>
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