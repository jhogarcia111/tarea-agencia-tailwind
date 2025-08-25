import { supabase } from '@/integrations/supabase/client';

// Types for our database entities
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive';
  task_count: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  client_id: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  created_date: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  // Relations
  assignee?: Profile;
  client?: Client;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  user_name: string;
  action: string;
  details?: string;
  created_at: string;
}

export interface ErrorLog {
  id: string;
  user_id?: string;
  user_role?: string;
  location: string;
  form_name?: string;
  message: string;
  created_at: string;
}

export interface ChangeLog {
  id: string;
  user_id?: string;
  user_name: string;
  entity_type: 'user' | 'client' | 'task';
  entity_id: string;
  action: 'create' | 'update' | 'delete';
  changes?: any;
  created_at: string;
}

// Profile service
export const profileService = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Profile[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async update(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data as Profile;
  }
};

// Client service
export const clientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Client[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  async create(client: Omit<Client, 'id' | 'task_count' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  async update(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Task service
export const taskService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(*),
        client:clients!tasks_client_id_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Task[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(*),
        client:clients!tasks_client_id_fkey(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'assignee' | 'client'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(*),
        client:clients!tasks_client_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async update(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(*),
        client:clients!tasks_client_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(*),
        client:clients!tasks_client_id_fkey(*)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Task[];
  },

  async getByAssignee(assigneeId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(*),
        client:clients!tasks_client_id_fkey(*)
      `)
      .eq('assignee_id', assigneeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Task[];
  }
};

// Activity log service
export const activityLogService = {
  async getAll() {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ActivityLog[];
  },

  async create(log: Omit<ActivityLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data as ActivityLog;
  }
};

// Error log service
export const errorLogService = {
  async getAll() {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ErrorLog[];
  },

  async create(log: Omit<ErrorLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('error_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data as ErrorLog;
  }
};

// Change log service
export const changeLogService = {
  async getAll() {
    const { data, error } = await supabase
      .from('change_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ChangeLog[];
  },

  async create(log: Omit<ChangeLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('change_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data as ChangeLog;
  }
};

// Auth service
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, name: string) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};