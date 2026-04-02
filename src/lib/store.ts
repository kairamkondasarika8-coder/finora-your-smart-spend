import { useState, useCallback } from 'react';
import { Transaction, SavingsGoal } from './types';

const STORAGE_KEY = 'finora_transactions';
const GOALS_KEY = 'finora_goals';
const BUDGET_KEY = 'finora_budget';

function loadTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getSampleData();
  } catch { return getSampleData(); }
}

function saveTransactions(txs: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
}

function loadGoals(): SavingsGoal[] {
  try {
    const data = localStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : [
      { id: '1', name: 'Emergency Fund', target: 5000, current: 2100 },
      { id: '2', name: 'Vacation', target: 3000, current: 800 },
    ];
  } catch { return []; }
}

function saveGoals(goals: SavingsGoal[]) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function loadBudget(): number {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : 2000;
  } catch { return 2000; }
}

export function saveBudget(budget: number) {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
}

function getSampleData(): Transaction[] {
  const now = new Date();
  const d = (daysAgo: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  return [
    { id: '1', type: 'income', amount: 4500, category: 'income', description: 'Monthly Salary', date: d(0), createdAt: new Date().toISOString() },
    { id: '2', type: 'expense', amount: 45.50, category: 'food', description: 'Grocery Shopping', date: d(1), createdAt: new Date().toISOString() },
    { id: '3', type: 'expense', amount: 120, category: 'bills', description: 'Electricity Bill', date: d(2), createdAt: new Date().toISOString() },
    { id: '4', type: 'expense', amount: 35, category: 'entertainment', description: 'Netflix & Spotify', date: d(3), createdAt: new Date().toISOString() },
    { id: '5', type: 'expense', amount: 250, category: 'shopping', description: 'New Sneakers', date: d(4), createdAt: new Date().toISOString() },
    { id: '6', type: 'expense', amount: 60, category: 'travel', description: 'Uber rides', date: d(5), createdAt: new Date().toISOString() },
    { id: '7', type: 'income', amount: 500, category: 'income', description: 'Freelance Project', date: d(6), createdAt: new Date().toISOString() },
    { id: '8', type: 'expense', amount: 89, category: 'health', description: 'Gym Membership', date: d(7), createdAt: new Date().toISOString() },
    { id: '9', type: 'expense', amount: 150, category: 'education', description: 'Online Course', date: d(10), createdAt: new Date().toISOString() },
    { id: '10', type: 'expense', amount: 22, category: 'food', description: 'Coffee & Lunch', date: d(0), createdAt: new Date().toISOString() },
  ];
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    setTransactions(prev => {
      const next = [{ ...tx, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...prev];
      saveTransactions(next);
      return next;
    });
  }, []);

  const updateTransaction = useCallback((id: string, tx: Partial<Transaction>) => {
    setTransactions(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...tx } : t);
      saveTransactions(next);
      return next;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const next = prev.filter(t => t.id !== id);
      saveTransactions(next);
      return next;
    });
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return { transactions, addTransaction, updateTransaction, deleteTransaction, totalIncome, totalExpenses, balance };
}

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>(loadGoals);

  const addGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    setGoals(prev => {
      const next = [...prev, { ...goal, id: crypto.randomUUID() }];
      saveGoals(next);
      return next;
    });
  }, []);

  const updateGoal = useCallback((id: string, data: Partial<SavingsGoal>) => {
    setGoals(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...data } : g);
      saveGoals(next);
      return next;
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => {
      const next = prev.filter(g => g.id !== id);
      saveGoals(next);
      return next;
    });
  }, []);

  return { goals, addGoal, updateGoal, deleteGoal };
}
