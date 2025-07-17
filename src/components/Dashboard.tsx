'use client';

import { ExpenseSummary, ExpenseCategory } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { DollarSign, Calendar, TrendingUp, PieChart } from 'lucide-react';

interface DashboardProps {
  summary: ExpenseSummary;
}

export function Dashboard({ summary }: DashboardProps) {
  const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
      Food: 'bg-green-500',
      Transportation: 'bg-blue-500',
      Entertainment: 'bg-purple-500',
      Shopping: 'bg-pink-500',
      Bills: 'bg-red-500',
      Other: 'bg-gray-500',
    };
    return colors[category];
  };


  const summaryCards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.total),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlyTotal),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Top Category',
      value: summary.topCategories[0]?.category || 'None',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Categories',
      value: summary.topCategories.filter(cat => cat.amount > 0).length.toString(),
      icon: PieChart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={cn('p-3 rounded-full', card.bgColor)}>
                <card.icon size={24} className={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          {summary.topCategories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
          ) : (
            <div className="space-y-3">
              {summary.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', getCategoryColor(category.category))} />
                    <span className="font-medium text-gray-900">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(category.amount)}</p>
                    <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Overview</h3>
          {summary.topCategories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data to display</p>
          ) : (
            <div className="space-y-4">
              {summary.topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn('h-2 rounded-full transition-all duration-300', getCategoryColor(category.category))}
                      style={{ width: `${Math.max(category.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {summary.total > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Current Month Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.monthlyTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">All Time Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}