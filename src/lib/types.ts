export type Category = 'food' | 'travel' | 'shopping' | 'bills' | 'education' | 'entertainment' | 'health' | 'income' | 'other';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: Category;
  description: string;
  date: string;
  createdAt: string;
}

export interface BudgetLimit {
  category: Category;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export const CATEGORIES: Record<Category, { label: string; emoji: string; color: string }> = {
  food: { label: 'Food', emoji: '🍔', color: 'hsl(25, 95%, 55%)' },
  travel: { label: 'Travel', emoji: '✈️', color: 'hsl(200, 90%, 50%)' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: 'hsl(330, 80%, 55%)' },
  bills: { label: 'Bills', emoji: '💡', color: 'hsl(45, 95%, 50%)' },
  education: { label: 'Education', emoji: '📚', color: 'hsl(258, 85%, 60%)' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: 'hsl(170, 80%, 45%)' },
  health: { label: 'Health', emoji: '🏥', color: 'hsl(0, 80%, 55%)' },
  income: { label: 'Income', emoji: '💰', color: 'hsl(145, 70%, 45%)' },
  other: { label: 'Other', emoji: '📦', color: 'hsl(240, 10%, 50%)' },
};
