'use client';

import { useState } from 'react';
import { Record } from '@/types/Record';
import deleteRecord from '@/app/actions/deleteRecord';
import LoadingSpinner from './LoadingSpinner';

// Helper function to get category emoji
const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'Food':
      return '🍔';
    case 'Transportation':
      return '🚗';
    case 'Shopping':
      return '🛒';
    case 'Entertainment':
      return '🎬';
    case 'Bills':
      return '💡';
    case 'Healthcare':
      return '🏥';
    default:
      return '📦';
  }
};

const RecordItemEnhanced = ({ record }: { record: Record }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteRecord = async (recordId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteRecord(recordId);
      if (result.error) {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to delete record. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Determine expense level for styling
  const getExpenseLevel = (amount: number) => {
    if (amount <= 100) return 'low';
    if (amount <= 1000) return 'medium';
    return 'high';
  };

  const expenseLevel = getExpenseLevel(record.Amount);
  
  const levelStyles = {
    low: 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10',
    medium: 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10', 
    high: 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10'
  };

  return (
    <div className={`${levelStyles[expenseLevel]} border-l-4 p-4 rounded-lg backdrop-blur-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">{getCategoryEmoji(record.category)}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {record.text}
              </h3>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-full">
                {record.category}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(record.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ₹{record.Amount.toLocaleString('en-IN')}
            </div>
            <div className={`text-xs font-medium ${
              expenseLevel === 'low' ? 'text-green-600 dark:text-green-400' :
              expenseLevel === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {expenseLevel} expense
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Delete expense"
            >
              {isDeleting ? <LoadingSpinner size="sm" /> : <span className="text-sm">🗑️</span>}
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteRecord(record.id)}
              disabled={isDeleting}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordItemEnhanced;
