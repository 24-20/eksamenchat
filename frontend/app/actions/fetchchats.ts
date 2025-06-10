// app/actions/chats.ts
'use server';
import { createClient } from '@/lib/supabase/server';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

export async function fetchUserChats() {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'User not authenticated', data: [] };
  }

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }); // Most recent first

  if (error) {
    console.error('Error fetching chats:', error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [], error: null };
}

