import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Wallet, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StatCards } from '@/components/StatCards';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { SpendingChart } from '@/components/SpendingChart';
import { BudgetTracker } from '@/components/BudgetTracker';
import { SavingsGoals } from '@/components/SavingsGoals';
import { useTransactions, useSavingsGoals, loadBudget, saveBudget } from '@/lib/store';
import { Transaction } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, totalIncome, totalExpenses, balance } = useTransactions();
  const { goals, addGoal, updateGoal, deleteGoal } = useSavingsGoals();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');
  const [budget, setBudgetState] = useState(loadBudget);

  const filtered = useMemo(() => {
    if (!search) return transactions.slice(0, 20);
    const q = search.toLowerCase();
    return transactions.filter(t => t.description.toLowerCase().includes(q) || t.category.includes(q));
  }, [transactions, search]);

  const handleSave = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editTx) {
      updateTransaction(editTx.id, tx);
      toast.success('Transaction updated');
    } else {
      addTransaction(tx);
      toast.success('Transaction added');
      // Budget alert
      const newTotal = totalExpenses + (tx.type === 'expense' ? tx.amount : 0);
      if (tx.type === 'expense' && newTotal > budget) {
        toast.warning(`⚠️ You've exceeded your budget of $${budget}!`);
      }
    }
    setEditTx(null);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success('Transaction deleted');
  };

  const handleBudgetChange = (b: number) => {
    setBudgetState(b);
    saveBudget(b);
    toast.success('Budget updated');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display">Finora</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-secondary transition-colors" title="Back to landing">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24">
        <StatCards balance={balance} totalIncome={totalIncome} totalExpenses={totalExpenses} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <SpendingChart transactions={transactions} />

            {/* Transactions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold font-display text-lg">Recent Transactions</h3>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <TransactionList
                transactions={filtered}
                onEdit={tx => { setEditTx(tx); setDialogOpen(true); }}
                onDelete={handleDelete}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BudgetTracker totalExpenses={totalExpenses} budget={budget} onBudgetChange={handleBudgetChange} />
            <SavingsGoals goals={goals} onAdd={addGoal} onUpdate={updateGoal} onDelete={deleteGoal} />
          </div>
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={() => { setEditTx(null); setDialogOpen(true); }}
        className="floating-btn"
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editTx={editTx}
      />
    </div>
  );
}
