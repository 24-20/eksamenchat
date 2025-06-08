// app/actions/messages.ts
'use server';

import { createClient } from '@/lib/supabase/server'; // Corrected path to your Supabase client

interface NewMessage {
  chat_id: string; // UUID will be passed as a string
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function insertMessage(message: NewMessage) {
  const supabase = await createClient(); // Await the creation of the Supabase client

  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: message.chat_id,
      role: message.role,
      content: message.content,
    })
    .select(); // .select() returns the inserted row(s)

  if (error) {
    console.error('Error inserting message:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
