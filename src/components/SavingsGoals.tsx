import { motion } from 'framer-motion';
import { Plus, Target, Trash2 } from 'lucide-react';
import { SavingsGoal } from '@/lib/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  goals: SavingsGoal[];
  onAdd: (g: Omit<SavingsGoal, 'id'>) => void;
  onUpdate: (id: string, data: Partial<SavingsGoal>) => void;
  onDelete: (id: string) => void;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function SavingsGoals({ goals, onAdd, onUpdate, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    onAdd({ name, target: parseFloat(target), current: 0 });
    setName(''); setTarget(''); setOpen(false);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold font-display text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Savings Goals
          </h3>
          <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-4">
          {goals.map(g => {
            const pct = Math.min((g.current / g.target) * 100, 100);
            return (
              <div key={g.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{g.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{fmt(g.current)} / {fmt(g.target)}</span>
                    <button onClick={() => onDelete(g.id)} className="p-1 rounded hover:bg-destructive/10">
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden cursor-pointer" onClick={() => {
                  const add = g.target * 0.1;
                  onUpdate(g.id, { current: Math.min(g.current + add, g.target) });
                }}>
                  <motion.div
                    className="h-full rounded-full gradient-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{pct.toFixed(0)}% complete</p>
              </div>
            );
          })}
          {goals.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No goals yet. Add one!</p>}
        </div>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-display">New Savings Goal</DialogTitle></DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div><Label>Goal Name</Label><Input className="mt-1" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Emergency Fund" required /></div>
            <div><Label>Target Amount</Label><Input className="mt-1" type="number" min="1" value={target} onChange={e => setTarget(e.target.value)} placeholder="5000" required /></div>
            <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold">Create Goal</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
