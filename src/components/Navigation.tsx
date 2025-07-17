'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, List, Plus, Download, Menu, X } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'expenses' | 'add';
  onTabChange: (tab: 'dashboard' | 'expenses' | 'add') => void;
  onExport?: () => void;
}

export function Navigation({ activeTab, onTabChange, onExport }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses' as const, label: 'Expenses', icon: List },
    { id: 'add' as const, label: 'Add Expense', icon: Plus },
  ];

  const handleTabChange = (tab: 'dashboard' | 'expenses' | 'add') => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-300"
              >
                <Download size={16} />
                Export
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            
            {onExport && (
              <button
                onClick={() => {
                  onExport();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-300"
              >
                <Download size={16} />
                Export CSV
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}