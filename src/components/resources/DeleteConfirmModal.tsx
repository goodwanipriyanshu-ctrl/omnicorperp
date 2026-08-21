import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  resourceName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteModalProps> = ({
  isOpen,
  resourceName,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-5 flex items-start gap-4">
          <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Resource</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium text-gray-900">{resourceName}</span>? 
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded hover:bg-red-700 flex items-center gap-2"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
