import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useData } from "../context/DataContext";
import { CATEGORY_COLORS, EXPENSE_CATEGORIES, money, sum, today } from "../utils";

export default function Summary() {
  const { transactions, loading } = useData();
  const [month, setMonth] = useState(today().slice(0, 7));

  const expenses = useMemo(
    () => transactions.filter((t) => t.type === "expense" && (!month || t.date.startsWith(month))),
    [transactions, month]
  );

  const rows = useMemo(() => {
    const cats = [...new Set([...EXPENSE_CATEGORIES, ...expenses.map((t) => t.category)])];
    return cats
      .map((name) => ({ name, value: sum(expenses.filter((t) => t.category === name)) }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (loading) return <p className="muted">Loading…</p>;
  const total = sum(expenses);

  return (
    <>
      <header className="page-head">
        <h1>Spending summary</h1>
        <label className="inline">
          Month
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
      </header>

      {rows.length === 0 ? (
        <div className="empty">
          <p>No expenses recorded for this period.</p>
        </div>
      ) : (
        <div className="summary-grid panel">
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={rows} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                  {rows.map((r) => (
                    <Cell key={r.name} fill={CATEGORY_COLORS[r.name] || "#7a8b86"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => money(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center">
              <span>Total spent</span>
              <strong>{money(total)}</strong>
            </div>
          </div>
          <ul className="cat-list">
            {rows.map((r) => (
              <li key={r.name}>
                <span className="swatch" style={{ background: CATEGORY_COLORS[r.name] || "#7a8b86" }} />
                <span className="cat-name">{r.name}</span>
                <span className="cat-pct">{Math.round((r.value / total) * 100)}%</span>
                <strong>{money(r.value)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
