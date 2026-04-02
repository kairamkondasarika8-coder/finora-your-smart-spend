import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Transaction, CATEGORIES, Category } from '@/lib/types';
import { useState } from 'react';

interface Props {
  transactions: Transaction[];
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function SpendingChart({ transactions }: Props) {
  const [view, setView] = useState<'pie' | 'bar'>('pie');

  const expenses = transactions.filter(t => t.type === 'expense');
  const byCategory = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.entries(byCategory).map(([key, value]) => ({
    name: CATEGORIES[key as Category]?.label || key,
    value,
    color: CATEGORIES[key as Category]?.color || '#888',
    emoji: CATEGORIES[key as Category]?.emoji || '📦',
  })).sort((a, b) => b.value - a.value);

  // Last 7 days bar data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const dayExpenses = expenses.filter(t => t.date === key).reduce((s, t) => s + t.amount, 0);
    const dayIncome = transactions.filter(t => t.type === 'income' && t.date === key).reduce((s, t) => s + t.amount, 0);
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), expenses: dayExpenses, income: dayIncome };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold font-display text-lg">Spending Analytics</h3>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setView('pie')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${view === 'pie' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >
            Pie
          </button>
          <button
            onClick={() => setView('bar')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${view === 'bar' ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >
            Bar
          </button>
        </div>
      </div>

      {view === 'pie' ? (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-3 text-sm">
                <span>{d.emoji}</span>
                <span className="flex-1">{d.name}</span>
                <span className="font-medium">{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Bar dataKey="income" fill="hsl(145, 70%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="hsl(0, 80%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
