import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

// Database helpers for commands
export const saveCommand = async (userId: string, commandData: any) => {
  const { data, error } = await supabase
    .from('commands')
    .insert([
      {
        user_id: userId,
        image_url: commandData.imageSrc,
        items: commandData.items,
        created_at: new Date().toISOString(),
      },
    ])
    .select();
  
  return { data, error };
};

export const getUserCommands = async (userId: string) => {
  const { data, error } = await supabase
    .from('commands')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const deleteCommand = async (commandId: string) => {
  const { error } = await supabase
    .from('commands')
    .delete()
    .eq('id', commandId);
  
  return { error };
}; 