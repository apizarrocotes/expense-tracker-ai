'use client';

import { useState } from 'react';
import { Expense, ExpenseFilters, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Search, Filter, Trash2, Edit, Calendar, DollarSign } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete?: (expense: Expense) => void;
  onEdit?: (expense: Expense) => void;
  onFilter?: (filters: ExpenseFilters) => void;
  loading?: boolean;
}

export function ExpenseList({ expenses, onDelete, onEdit, onFilter, loading }: ExpenseListProps) {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: ExpenseFilters = {};
    setFilters(emptyFilters);
    onFilter?.(emptyFilters);
  };

  const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
      Food: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Filtered
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            <Filter size={16} />
            Filter
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => handleFilterChange({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange({ ...filters, category: e.target.value as ExpenseCategory || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <DollarSign size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">
            {hasActiveFilters ? 'No expenses match your filters' : 'No expenses yet'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900">{expense.description}</h3>
                  <span className={cn('px-2 py-1 text-xs rounded-full', getCategoryColor(expense.category))}>
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(expense.date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit expense"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={() => onDelete(expense)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}