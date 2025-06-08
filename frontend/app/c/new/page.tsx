// app/new-chat/page.tsx
import { insertChat } from '@/app/actions/insertchat'; // Import your new server action
import { redirect } from 'next/navigation'; // Next.js utility for server-side redirects

// Define the props interface for the page component to receive search parameters
interface NewChatPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * NewChatPage component. This is a server component that creates a new chat
 * and redirects the user to the chat page, preserving any existing search parameters.
 *
 * @param {NewChatPageProps} { searchParams } - The search parameters from the URL.
 */
export default async function NewChatPage({ searchParams }: NewChatPageProps) {
  // Call the server action to create a new chat
  const { success, chatId, error } = await insertChat();

  // Handle cases where chat creation failed (e.g., database error, no user ID)
  if (!success || !chatId) {
    console.error('Failed to create new chat, redirecting to home:', error);
    redirect('/'); // Redirect to a safe fallback page, like your home page
  }

  // Prepare URLSearchParams to carry over any existing search parameters
  const params = new URLSearchParams();
  for (const key in searchParams) {
    const value = searchParams[key];
    if (value) {
      if (Array.isArray(value)) {
        // If the search param is an array (e.g., ?key=val1&key=val2)
        value.forEach((v) => params.append(key, v));
      } else {
        // If it's a single value
        params.append(key, value);
      }
    }
  }

  // Construct the full redirection URL: /c/[chatid]?param1=value1&param2=value2
  const queryString = params.toString();
  const redirectToUrl = `/c/${chatId}${queryString ? `?${queryString}` : ''}`;

  // Perform the server-side redirect
  redirect(redirectToUrl);

  // This component technically returns JSX, but the redirect will happen before it renders.
  // A small message for clarity if the redirect takes a moment.
}
