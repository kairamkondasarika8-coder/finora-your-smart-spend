import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { Transaction, CATEGORIES } from '@/lib/types';

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function TransactionList({ transactions, onEdit, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {transactions.map(tx => {
          const cat = CATEGORIES[tx.category];
          return (
            <motion.div
              key={tx.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:scale-[1.01] transition-transform"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: cat.color + '20' }}
              >
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{cat.label} · {new Date(tx.date).toLocaleDateString()}</p>
              </div>
              <p className={`font-semibold text-sm whitespace-nowrap ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
              </p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(tx)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => onDelete(tx.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
