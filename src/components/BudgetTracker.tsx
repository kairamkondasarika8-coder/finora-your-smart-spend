import { motion } from 'framer-motion';
import { AlertTriangle, Settings } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  totalExpenses: number;
  budget: number;
  onBudgetChange: (b: number) => void;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function BudgetTracker({ totalExpenses, budget, onBudgetChange }: Props) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(String(budget));
  const pct = Math.min((totalExpenses / budget) * 100, 100);
  const exceeded = totalExpenses > budget;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card rounded-2xl p-6 ${exceeded ? 'ring-2 ring-destructive/50' : ''}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold font-display text-lg flex items-center gap-2">
            Budget Limit
            {exceeded && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />}
          </h3>
          <button onClick={() => { setVal(String(budget)); setOpen(true); }} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Spent: {fmt(totalExpenses)}</span>
          <span className="text-muted-foreground">Limit: {fmt(budget)}</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${exceeded ? 'gradient-expense' : 'gradient-primary'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className={`text-xs mt-2 ${exceeded ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {exceeded ? `⚠️ Over budget by ${fmt(totalExpenses - budget)}!` : `${fmt(budget - totalExpenses)} remaining`}
        </p>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-display">Set Monthly Budget</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); onBudgetChange(parseFloat(val) || budget); setOpen(false); }} className="space-y-4">
            <Input type="number" min="0" step="100" value={val} onChange={e => setVal(e.target.value)} />
            <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
