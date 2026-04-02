import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface Props {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function StatCards({ balance, totalIncome, totalExpenses }: Props) {
  const cards = [
    { label: 'Total Balance', value: fmt(balance), icon: Wallet, gradient: 'gradient-balance' },
    { label: 'Total Income', value: fmt(totalIncome), icon: TrendingUp, gradient: 'gradient-income' },
    { label: 'Total Expenses', value: fmt(totalExpenses), icon: TrendingDown, gradient: 'gradient-expense' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`stat-card ${c.gradient} rounded-2xl`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium opacity-90">{c.label}</span>
            <c.icon className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-2xl md:text-3xl font-bold font-display">{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
