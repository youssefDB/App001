
import React from 'react';

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center text-white p-8 max-w-2xl mx-auto bg-red-900/50 backdrop-blur-sm rounded-3xl border border-red-700 shadow-xl">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500 mb-4">
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-red-300">أووبس! شي حاجة ما هياش</h2>
      <p className="text-lg mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 text-xl rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        عاود حاول
      </button>
    </div>
  );
};
