"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrencyHKD } from "@/lib/money";

interface Expense { summary: string; amount: number; category: string; }

export default function Home() {
  const [summary, setSummary] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!summary.trim()) {
      setError("Summary is required");
      return;
    }
    const num = Number(amount);
    if (!(num > 0)) {
      setError("Amount must be positive");
      return;
    }
    const decimals = amount.includes('.') ? amount.split('.')[1] : '';
    if (decimals.length > 2) {
      setError('Amount must have at most 2 decimals');
      return;
    }
    let normalizedCategory = category.trim().toLowerCase();
    if (!normalizedCategory) {
      normalizedCategory = 'uncategorized';
    }
    const newExpense = { summary: summary.trim(), amount: num, category: normalizedCategory };
    setExpenses(prev => [...prev, newExpense]);
    setSummary(""); setAmount(""); setCategory("");
  }

  return (
    <main className="max-w-2xl mx-auto p-6 flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Expense Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-test="expense-form">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="summary">Summary</label>
              <Input id="summary" data-test="summary" value={summary} onChange={e=>setSummary(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="amount">Amount</label>
              <Input id="amount" data-test="amount" type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="category">Category</label>
              <Input id="category" data-test="category" value={category} onChange={e=>setCategory(e.target.value)} />
            </div>
            {error && <div className="text-red-600 text-sm" data-test="error">{error}</div>}
            <CardFooter className="p-0">
              <Button data-test="submit-expense" size="sm" type="submit">Add Expense</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <section className="flex flex-col gap-2" aria-label="Recorded expenses">
        {expenses.map((ex,i) => (
          <Card key={i} data-test="expense-row" className="flex flex-row items-center justify-between gap-4 py-2">
            <span className="font-medium" aria-label="summary">{ex.summary}</span>
            <span className="tabular-nums" aria-label="amount">{formatCurrencyHKD(ex.amount)}</span>
            <span className="opacity-70 text-xs uppercase tracking-wide" aria-label="category">{ex.category}</span>
          </Card>
        ))}
      </section>
    </main>
  );
}
