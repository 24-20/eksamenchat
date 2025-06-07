// components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ input, setInput, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="flex mt-4 space-x-2 fixed bottom-8">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Still et matematisk spørsmål..."
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        Send
      </button>
    </form>
  );
};

export default InputField;
