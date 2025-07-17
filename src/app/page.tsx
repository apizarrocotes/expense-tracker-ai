'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseFilters, Expense, ExpenseFormData } from '@/types';
import { downloadCSV } from '@/lib/utils';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { EditExpenseModal } from '@/components/EditExpenseModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'add'>('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  
  const {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    loadExpenses,
    getSummary,
    exportToCSV,
  } = useExpenses();

  const handleAddExpense = async (formData: ExpenseFormData) => {
    await addExpense(formData);
    setActiveTab('expenses');
  };

  const handleUpdateExpense = async (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => {
    await updateExpense(id, updates);
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
    setDeletingExpense(null);
  };

  const handleFilter = (filters: ExpenseFilters) => {
    loadExpenses(filters);
  };

  const handleExport = () => {
    const csvContent = exportToCSV();
    if (csvContent) {
      downloadCSV(csvContent, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const summary = getSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExport={handleExport}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard summary={summary} />
        )}

        {activeTab === 'expenses' && (
          <ExpenseList
            expenses={expenses}
            loading={loading}
            onDelete={(expense) => setDeletingExpense(expense)}
            onEdit={setEditingExpense}
            onFilter={handleFilter}
          />
        )}

        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Expense</h2>
              <ExpenseForm
                onSubmit={handleAddExpense}
                loading={loading}
              />
            </div>
          </div>
        )}
      </main>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onUpdate={handleUpdateExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {deletingExpense && (
        <DeleteConfirmModal
          expense={deletingExpense}
          onDelete={handleDeleteExpense}
          onClose={() => setDeletingExpense(null)}
        />
      )}
    </div>
  );
}