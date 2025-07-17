import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseFilters, ExpenseSummary, ExpenseFormData } from '@/types';
import { ExpenseStorage } from '@/lib/storage';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storage = ExpenseStorage.getInstance();

  const loadExpenses = useCallback((filters?: ExpenseFilters) => {
    try {
      setLoading(true);
      setError(null);
      const loadedExpenses = storage.getExpenses(filters);
      setExpenses(loadedExpenses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [storage]);

  const addExpense = useCallback(async (formData: ExpenseFormData) => {
    try {
      setError(null);
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: formData.date,
      };

      const newExpense = storage.addExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [storage]);

  const updateExpense = useCallback(async (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setError(null);
      const updatedExpense = storage.updateExpense(id, updates);
      if (updatedExpense) {
        setExpenses(prev => prev.map(expense => expense.id === id ? updatedExpense : expense));
        return updatedExpense;
      }
      throw new Error('Expense not found');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [storage]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = storage.deleteExpense(id);
      if (success) {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
      } else {
        throw new Error('Expense not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [storage]);

  const getSummary = useCallback((): ExpenseSummary => {
    return storage.getExpenseSummary();
  }, [storage]);

  const exportToCSV = useCallback(() => {
    return storage.exportToCSV();
  }, [storage]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    loadExpenses,
    getSummary,
    exportToCSV,
  };
}