import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, PiggyBank, Shield, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const features = [
  { icon: Wallet, title: 'Track Expenses', desc: 'Log every transaction with smart categorization' },
  { icon: BarChart3, title: 'Visual Analytics', desc: 'Beautiful charts to understand your spending' },
  { icon: PiggyBank, title: 'Savings Goals', desc: 'Set targets and watch your savings grow' },
  { icon: Shield, title: 'Budget Alerts', desc: 'Get warned before you overspend' },
  { icon: TrendingUp, title: 'Income Tracking', desc: 'Monitor all income sources in one place' },
  { icon: Sparkles, title: 'Smart Insights', desc: 'AI-powered tips to optimize spending' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display">Finora</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 rounded-full gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            ✨ Your Personal Finance Companion
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
            Track Smart.<br />
            <span className="text-gradient">Spend Better.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Finora helps you manage expenses, set budgets, and achieve savings goals — all in one beautifully designed dashboard.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow animate-pulse_glow"
          >
            Launch Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Floating cards */}
        <motion.div
          className="absolute top-32 -left-4 glass-card rounded-2xl p-4 hidden lg:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-8 h-8 rounded-full gradient-income flex items-center justify-center text-primary-foreground text-xs">↑</span>
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Income</div>
              <div className="font-semibold">+$4,500</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-48 -right-4 glass-card rounded-2xl p-4 hidden lg:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-8 h-8 rounded-full gradient-expense flex items-center justify-center text-primary-foreground text-xs">↓</span>
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Saved</div>
              <div className="font-semibold text-income">$1,200</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-4">
          Everything you need
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          Powerful features wrapped in a delightful experience
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-display mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-border">
        <p className="text-sm text-muted-foreground">© 2026 Finora. Track Smart. Spend Better.</p>
      </footer>
    </div>
  );
}
