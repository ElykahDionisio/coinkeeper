import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, today } from "../utils";

const blank = () => ({ type: "expense", amount: "", category: EXPENSE_CATEGORIES[0], date: today(), description: "" });

export default function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, loading, addTransaction, updateTransaction } = useData();
  const editing = Boolean(id);
  const existing = transactions.find((t) => t.id === id);

  const [form, setForm] = useState(blank());
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        type: existing.type,
        amount: String(existing.amount),
        category: existing.category,
        date: existing.date,
        description: existing.description || "",
      });
    }
  }, [existing?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = form.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setType = (type) =>
    setForm({ ...form, type, category: (type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES)[0] });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    const amount = Number(form.amount);
    if (!(amount > 0)) return setError("Enter an amount greater than 0.");
    if (!form.date) return setError("Choose a date.");

    const payload = {
      type: form.type,
      amount: Math.round(amount * 100) / 100,
      category: form.category,
      date: form.date,
      description: form.description.trim(),
    };

    setBusy(true);
    try {
      if (editing) {
        await updateTransaction(id, payload);
        navigate("/history");
      } else {
        await addTransaction(payload);
        setForm({ ...blank(), type: form.type, category: form.category, date: form.date });
        setNotice(`${form.type === "expense" ? "Expense" : "Income"} added.`);
      }
    } catch {
      setError("Could not save. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (editing && loading) return <p className="muted">Loading…</p>;
  if (editing && !existing) {
    return (
      <div className="empty">
        <p>This transaction no longer exists.</p>
        <button className="btn" onClick={() => navigate("/history")}>
          Back to history
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="page-head">
        <h1>{editing ? "Edit transaction" : "Add transaction"}</h1>
      </header>
      <form className="form panel" onSubmit={submit}>
        {error && <p className="alert alert-error">{error}</p>}
        {notice && <p className="alert alert-ok">{notice}</p>}

        <div className="segmented" role="group" aria-label="Transaction type">
          <button type="button" className={form.type === "expense" ? "on" : ""} onClick={() => setType("expense")}>
            Expense
          </button>
          <button type="button" className={form.type === "income" ? "on" : ""} onClick={() => setType("income")}>
            Income
          </button>
        </div>

        <div className="grid-2">
          <label>
            Amount (PHP)
            <input type="number" inputMode="decimal" min="0.01" step="0.01" value={form.amount} onChange={set("amount")} placeholder="0.00" required />
          </label>
          <label>
            Date
            <input type="date" value={form.date} onChange={set("date")} required />
          </label>
        </div>

        <label>
          Category
          <select value={form.category} onChange={set("category")}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Description (optional)
          <input value={form.description} onChange={set("description")} maxLength={200} placeholder="e.g. Lunch at canteen" />
        </label>

        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : editing ? "Save changes" : "Add transaction"}
          </button>
          {editing && (
            <button type="button" className="btn" onClick={() => navigate("/history")}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}
