// app/actions/messages.ts
'use server';
import { createClient } from '@/lib/supabase/server';


export async function fetchMessagesByChatId(chatId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true }); // Order by created_at ascending to get oldest first

  if (error) {
    console.error('Error fetching messages:', error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [], error: null };
}
