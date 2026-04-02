import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, Category, CATEGORIES } from '@/lib/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTx?: Transaction | null;
}

const AUTO_CATEGORY_MAP: Record<string, Category> = {
  grocery: 'food', restaurant: 'food', coffee: 'food', lunch: 'food', dinner: 'food', pizza: 'food', uber: 'travel',
  taxi: 'travel', flight: 'travel', hotel: 'travel', gas: 'travel', amazon: 'shopping', mall: 'shopping',
  sneakers: 'shopping', clothes: 'shopping', electricity: 'bills', rent: 'bills', water: 'bills', internet: 'bills',
  phone: 'bills', wifi: 'bills', netflix: 'entertainment', spotify: 'entertainment', movie: 'entertainment',
  gym: 'health', doctor: 'health', pharmacy: 'health', course: 'education', book: 'education', tuition: 'education',
  salary: 'income', freelance: 'income', bonus: 'income', dividend: 'income',
};

function detectCategory(text: string): Category | null {
  const lower = text.toLowerCase();
  for (const [keyword, cat] of Object.entries(AUTO_CATEGORY_MAP)) {
    if (lower.includes(keyword)) return cat;
  }
  return null;
}

export function AddTransactionDialog({ open, onOpenChange, onSave, editTx }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editTx) {
      setType(editTx.type);
      setAmount(String(editTx.amount));
      setDescription(editTx.description);
      setCategory(editTx.category);
      setDate(editTx.date);
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('other');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editTx, open]);

  useEffect(() => {
    if (!editTx && description) {
      const detected = detectCategory(description);
      if (detected) {
        setCategory(detected);
        if (detected === 'income') setType('income');
      }
    }
  }, [description, editTx]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onSave({ type, amount: parseFloat(amount), description, category, date });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{editTx ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'expense' ? 'gradient-expense text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'income' ? 'gradient-income text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
            >
              Income
            </button>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" placeholder="e.g. Grocery shopping" value={description} onChange={e => setDescription(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={v => setCategory(v as Category)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.emoji} {val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold transition-opacity hover:opacity-90">
            {editTx ? 'Update' : 'Add Transaction'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
