import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import BudgetRing from "../components/BudgetRing";
import { money, sum, today } from "../utils";

export default function Budget() {
  const { transactions, budget, loading, saveBudget, clearBudget } = useData();
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setValue(budget > 0 ? String(budget) : "");
  }, [budget]);

  if (loading) return <p className="muted">Loading…</p>;

  const month = today().slice(0, 7);
  const spent = sum(transactions.filter((t) => t.type === "expense" && t.date.startsWith(month)));
  const left = budget - spent;
  const monthName = new Date().toLocaleDateString("en-PH", { month: "long", year: "numeric" });

  const submit = async (e) => {
    e.preventDefault();
    const amount = Number(value);
    if (!(amount > 0)) return setMsg({ type: "error", text: "Enter a budget greater than 0." });
    setBusy(true);
    try {
      await saveBudget(Math.round(amount * 100) / 100);
      setMsg({ type: "ok", text: "Budget saved." });
    } catch {
      setMsg({ type: "error", text: "Could not save your budget. Try again." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Remove your monthly budget?")) return;
    try {
      await clearBudget();
      setMsg({ type: "ok", text: "Budget removed." });
    } catch {
      setMsg({ type: "error", text: "Could not remove your budget. Try again." });
    }
  };

  return (
    <>
      <header className="page-head">
        <h1>Monthly budget</h1>
      </header>

      <div className="budget-grid">
        <section className="panel budget-status">
          <BudgetRing spent={spent} budget={budget} />
          <dl className="stat-list">
            <dt>Month</dt>
            <dd>{monthName}</dd>
            <dt>Budget</dt>
            <dd>{budget > 0 ? money(budget) : "Not set"}</dd>
            <dt>Total spending</dt>
            <dd>{money(spent)}</dd>
            <dt>Remaining</dt>
            <dd className={left < 0 && budget > 0 ? "neg" : ""}>{budget > 0 ? money(left) : "—"}</dd>
          </dl>
          {budget > 0 && spent > budget && (
            <p className="alert alert-error">You are over budget by {money(spent - budget)}.</p>
          )}
          {budget > 0 && spent <= budget && spent / budget >= 0.8 && (
            <p className="alert alert-warn">You have used {Math.round((spent / budget) * 100)}% of your budget.</p>
          )}
        </section>

        <form className="panel form" onSubmit={submit}>
          <h2>{budget > 0 ? "Change your budget" : "Set your budget"}</h2>
          {msg && <p className={`alert alert-${msg.type}`}>{msg.text}</p>}
          <label>
            Spending limit per month (PHP)
            <input type="number" inputMode="decimal" min="1" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 5000" required />
          </label>
          <div className="actions">
            <button className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save budget"}
            </button>
            {budget > 0 && (
              <button type="button" className="btn btn-danger" onClick={remove}>
                Remove budget
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
