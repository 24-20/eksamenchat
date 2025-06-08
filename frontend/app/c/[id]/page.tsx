// app/c/[id]/page.tsx
// This is a Server Component

import { Suspense } from 'react'; // Import Suspense for better loading states
import ChatClientWrapper from './client-wrapper'; // Corrected path to your new Client Component

interface PageProps {
  params: { id: string };
  // searchParams are automatically passed to Server Components
  searchParams: {
    // Next.js provides search parameters as 'string | undefined' if not present in URL
    prop_input?: string;
    submit?: string;
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id: chatId } = params; // Extract chat ID from params

  // Coalesce undefined searchParams values to null to match ChatClientWrapper's expected props (string | null)
  const initialPropInputForClient = searchParams.prop_input !== undefined ? searchParams.prop_input : null;
  const initialSubmitForClient = searchParams.submit !== undefined ? searchParams.submit : null;

  return (
    <div className="h-full w-full">
      {/* Use Suspense to handle potential delays if ChatClientWrapper fetches data or renders slowly */}
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatClientWrapper
          chatId={chatId}
          initialPropInput={initialPropInputForClient}
          initialSubmit={initialSubmitForClient}
        />
      </Suspense>
    </div>
  );
}
