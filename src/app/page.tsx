"use client";
import { useState } from "react";

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
    const normalizedCategory = category.trim().toLowerCase();
    const newExpense = { summary: summary.trim(), amount: num, category: normalizedCategory };
    setExpenses(prev => [...prev, newExpense]);
    setSummary(""); setAmount(""); setCategory("");
  }

  return (
    <main className="max-w-xl mx-auto p-6 flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Expense Entry</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-test="expense-form">
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor="summary">Summary</label>
          <input id="summary" data-test="summary" className="border rounded px-2 py-1" value={summary} onChange={e=>setSummary(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor="amount">Amount</label>
            <input id="amount" data-test="amount" type="number" step="0.01" className="border rounded px-2 py-1" value={amount} onChange={e=>setAmount(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor="category">Category</label>
          <input id="category" data-test="category" className="border rounded px-2 py-1" value={category} onChange={e=>setCategory(e.target.value)} />
        </div>
        {error && <div className="text-red-600 text-sm" data-test="error">{error}</div>}
        <div>
          <button data-test="submit-expense" className="bg-foreground text-background rounded px-4 py-2 text-sm" type="submit">Add Expense</button>
        </div>
      </form>
      <section className="flex flex-col gap-2">
        {expenses.map((ex,i) => (
          <div key={i} data-test="expense-row" className="border rounded p-2 flex justify-between text-sm">
            <span>{ex.summary}</span>
            <span>${""}{ex.amount.toFixed(2)}</span>
            <span className="opacity-70">{ex.category}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
