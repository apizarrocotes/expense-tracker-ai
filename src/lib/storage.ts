import { Expense, ExpenseFilters, ExpenseSummary, ExpenseCategory } from '@/types';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const STORAGE_KEY = 'expense-tracker-data';

export class ExpenseStorage {
  private static instance: ExpenseStorage;
  private expenses: Expense[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): ExpenseStorage {
    if (!ExpenseStorage.instance) {
      ExpenseStorage.instance = new ExpenseStorage();
    }
    return ExpenseStorage.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.expenses = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading expenses from storage:', error);
      this.expenses = [];
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.expenses));
    } catch (error) {
      console.error('Error saving expenses to storage:', error);
    }
  }

  addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };

    this.expenses.push(newExpense);
    this.saveToStorage();
    return newExpense;
  }

  updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>): Expense | null {
    const index = this.expenses.findIndex(expense => expense.id === id);
    if (index === -1) return null;

    const updatedExpense: Expense = {
      ...this.expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.expenses[index] = updatedExpense;
    this.saveToStorage();
    return updatedExpense;
  }

  deleteExpense(id: string): boolean {
    const index = this.expenses.findIndex(expense => expense.id === id);
    if (index === -1) return false;

    this.expenses.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  getExpense(id: string): Expense | null {
    return this.expenses.find(expense => expense.id === id) || null;
  }

  getExpenses(filters?: ExpenseFilters): Expense[] {
    let filteredExpenses = [...this.expenses];

    if (filters?.category) {
      filteredExpenses = filteredExpenses.filter(expense => expense.category === filters.category);
    }

    if (filters?.dateFrom) {
      const fromDate = parseISO(filters.dateFrom);
      filteredExpenses = filteredExpenses.filter(expense => parseISO(expense.date) >= fromDate);
    }

    if (filters?.dateTo) {
      const toDate = parseISO(filters.dateTo);
      filteredExpenses = filteredExpenses.filter(expense => parseISO(expense.date) <= toDate);
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredExpenses = filteredExpenses.filter(expense =>
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
      );
    }

    return filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getExpenseSummary(): ExpenseSummary {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyExpenses = this.expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });

    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryBreakdown: Record<ExpenseCategory, number> = {
      Food: 0,
      Transportation: 0,
      Entertainment: 0,
      Shopping: 0,
      Bills: 0,
      Other: 0,
    };

    this.expenses.forEach(expense => {
      categoryBreakdown[expense.category] += expense.amount;
    });

    const topCategories = Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      total,
      monthlyTotal,
      categoryBreakdown,
      topCategories,
    };
  }

  exportToCSV(): string {
    if (this.expenses.length === 0) return '';

    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = this.expenses.map(expense => [
      expense.date,
      expense.description,
      expense.category,
      expense.amount.toString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  clearAllExpenses(): void {
    this.expenses = [];
    this.saveToStorage();
  }
}