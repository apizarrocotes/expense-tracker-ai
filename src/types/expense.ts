export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

export interface ExpenseFormData {
  amount: string;
  description: string;
  category: ExpenseCategory;
  date: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export interface ExpenseSummary {
  total: number;
  monthlyTotal: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  topCategories: Array<{
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }>;
}