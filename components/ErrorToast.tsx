import React, { useEffect } from 'react';

interface ErrorToastProps {
  error: string;
  onClose: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ error, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-lg">Error</p>
          <button onClick={onClose} className="text-red-700 hover:text-red-900">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p>{error}</p>
      </div>
    </div>
  );
};

export default ErrorToast;