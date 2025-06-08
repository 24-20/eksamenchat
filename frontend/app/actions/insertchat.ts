
// app/actions/chats.ts
'use server';

import { createClient } from '@/lib/supabase/server'; // Adjust this path to your Supabase client
import { redirect } from 'next/navigation'; // For handling unauthenticated users

/**
 * Inserts a new chat entry into the 'chats' table for the current authenticated user.
 *
 * @returns {Promise<{ success: boolean; chatId: string | null; error: string | null }>}
 * An object indicating success, the new chat ID if successful, and an error message if not.
 */
export async function insertChat() {
  const supabase = await createClient();

  // Get the authenticated user's session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // If no user is authenticated, redirect them to the login page
  if (userError || !user) {
    console.error('User not authenticated for chat creation:', userError?.message);
    redirect('/login'); // Redirect to your login page
  }

  // Insert a new chat row with the authenticated user's ID
  const { data, error } = await supabase
    .from('chats')
    .insert({
      user_id: user.id, // Associate the chat with the current user
    })
    .select('id') // Only retrieve the newly generated chat ID
    .single(); // Expect only one row back

  if (error) {
    console.error('Error inserting new chat:', error);
    return { success: false, error: error.message, chatId: null };
  }

  return { success: true, chatId: data.id, error: null };
}
