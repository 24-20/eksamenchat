// app/c/[id]/_components/chat-client-wrapper.tsx
'use client'; // This directive marks the component as a Client Component

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import MathChatbot from "@/components/chate_area/display-chat"; // Your MathChatbot component

interface ChatClientWrapperProps {
  chatId: string;
  initialPropInput: string | null; // Prop passed from the Server Component
  initialSubmit: string | null;     // Prop passed from the Server Component
}

/**
 * Client-side wrapper component for the chat interface.
 * Handles client-side routing, search parameter manipulation, and renders the MathChatbot.
 * Ensures initial 'prop_input' and 'submit' values are processed once and then cleared.
 *
 * @param {ChatClientWrapperProps} { chatId, initialPropInput, initialSubmit } - Props from the Server Component.
 */
export default function ChatClientWrapper({
  chatId,
  initialPropInput,
  initialSubmit,
}: ChatClientWrapperProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Use state to manage the props passed to MathChatbot.
  // These are initialized with the values from the URL, but can be set to null later.
  const [propInputToMathChatbot, setPropInputToMathChatbot] = useState<string | null>(initialPropInput);
  const [submitToMathChatbot, setSubmitToMathChatbot] = useState<string | null>(initialSubmit);

  // A ref to ensure the initial URL parameter clearing logic runs only once.
  // This ref is crucial to prevent multiple URL replacements.
  const hasProcessedInitialParams = useRef(false);

  /**
   * Function to clear specific search parameters from the URL.
   * This updates the URL without adding a new entry to the browser history.
   */
  const clearParam = () => {
    // Only attempt to clear if the parameters are currently present in the URL
    // This check helps prevent unnecessary router.replace calls
    if (searchParams.has('prop_input') || searchParams.has('submit')) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('prop_input'); // Remove 'prop_input'
      params.delete('submit');     // Remove 'submit'
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  /**
   * useEffect hook to handle the initial submission logic and URL clearing.
   * This effect runs after the initial render and whenever `initialSubmit` changes.
   * The `hasProcessedInitialParams` ref ensures it only performs the clearing logic once.
   */
  useEffect(() => {
    // If 'initialSubmit' was provided (meaning it came from the URL)
    // AND we haven't processed these initial parameters yet:
    if (initialSubmit && !hasProcessedInitialParams.current) {
      // Clear the parameters from the URL.
      clearParam();

      // Immediately set the internal state for MathChatbot to null.
      // This causes a re-render of THIS component, ensuring MathChatbot
      // receives null for these props on its subsequent renders (after URL update).
      setPropInputToMathChatbot(null);
      setSubmitToMathChatbot(null);

      // Mark that the initial parameters have been processed to prevent re-running this logic.
      hasProcessedInitialParams.current = true;
    }
  }, [initialSubmit, pathname, router, searchParams]); // Dependencies: re-run if initialSubmit or routing context changes

  return (
    <div className="h-full w-full">
      {/*
        Render the MathChatbot component.
        It will receive the initial values on the very first render,
        and then null values on subsequent renders after the URL is cleared
        and the internal state is updated.
      */}
      <MathChatbot
        chatId={chatId}
        submit={submitToMathChatbot}
        prop_input={propInputToMathChatbot}
      />
    </div>
  );
}

