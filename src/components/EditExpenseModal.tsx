'use client';

import { useState } from 'react';
import { Expense, ExpenseFormData } from '@/types';
import { ExpenseForm } from './ExpenseForm';
import { X } from 'lucide-react';

interface EditExpenseModalProps {
  expense: Expense;
  onUpdate: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  onClose: () => void;
}

export function EditExpenseModal({ expense, onUpdate, onClose }: EditExpenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ExpenseFormData) => {
    try {
      setIsSubmitting(true);
      await onUpdate(expense.id, {
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: formData.date,
      });
      onClose();
    } catch (error) {
      console.error('Error updating expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialData: ExpenseFormData = {
    amount: expense.amount.toString(),
    description: expense.description,
    category: expense.category,
    date: expense.date,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            initialData={initialData}
            loading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}