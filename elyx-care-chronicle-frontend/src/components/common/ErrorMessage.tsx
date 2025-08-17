import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  title?: string;
  retry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = "Something went wrong. Please try again.", 
  title = "Error",
  retry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
