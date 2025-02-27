'use client';

import { Check, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  const typeStyles =
    type === 'success'
      ? 'bg-gray-800 border-green-500 text-green-300'
      : 'bg-gray-800 border-red-500 text-red-300';

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg border p-4 rounded-lg shadow-md flex justify-between items-center ${typeStyles}`}>
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
        <p className="text-base md:text-lg font-medium">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-200 focus:outline-none transition-colors duration-300"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;
