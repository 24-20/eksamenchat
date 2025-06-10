// app/actions/chats.ts
'use server';
import { createClient } from '@/lib/supabase/server';


export async function deleteChat(chatId: string) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'User not authenticated' };
  }

  // First, delete all messages associated with this chat
  const { error: messagesError } = await supabase
    .from('messages')
    .delete()
    .eq('chat_id', chatId);

  if (messagesError) {
    console.error('Error deleting messages:', messagesError);
    return { success: false, error: 'Failed to delete chat messages' };
  }

  // Then delete the chat itself, ensuring it belongs to the current user
  const { error: chatError } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId)
    .eq('user_id', user.id);

  if (chatError) {
    console.error('Error deleting chat:', chatError);
    return { success: false, error: 'Failed to delete chat' };
  }

  return { success: true, error: null };
}
