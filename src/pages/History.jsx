import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import TransactionItem from "../components/TransactionItem";
import { Pencil, Trash2, X } from "lucide-react";
import CategoryIcon from "../components/CategoryIcon";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, formatDate, money } from "../utils";

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export default function History() {
  const { transactions, loading, deleteTransaction } = useData();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ type: "", category: "", from: "", to: "", q: "" });
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (!filters.type || t.type === filters.type) &&
          (!filters.category || t.category === filters.category) &&
          (!filters.from || t.date >= filters.from) &&
          (!filters.to || t.date <= filters.to) &&
          (!filters.q || (t.description || "").toLowerCase().includes(filters.q.toLowerCase()))
      ),
    [transactions, filters]
  );

  const remove = async () => {
    if (!window.confirm("Delete this transaction? This cannot be undone.")) return;
    try {
      await deleteTransaction(selected.id);
      setSelected(null);
    } catch {
      setError("Could not delete. Try again.");
    }
  };

  if (loading) return <p className="muted">Loading your records…</p>;
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <header className="page-head">
        <h1>Transaction history</h1>
      </header>

      <div className="filters panel">
        <input placeholder="Search description" value={filters.q} onChange={set("q")} aria-label="Search description" />
        <select value={filters.type} onChange={set("type")} aria-label="Type">
          <option value="">All types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
        <select value={filters.category} onChange={set("category")} aria-label="Category">
          <option value="">All categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <label className="inline">
          From <input type="date" value={filters.from} onChange={set("from")} />
        </label>
        <label className="inline">
          To <input type="date" value={filters.to} onChange={set("to")} />
        </label>
        {hasFilters && (
          <button className="link" onClick={() => setFilters({ type: "", category: "", from: "", to: "", q: "" })}>
            Clear filters
          </button>
        )}
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      {filtered.length === 0 ? (
        <div className="empty">
          <p>{transactions.length === 0 ? "No transactions yet." : "No transactions match these filters."}</p>
        </div>
      ) : (
        <ul className="tx-list">
          {filtered.map((t) => (
            <TransactionItem key={t.id} t={t} onClick={() => setSelected(t)} />
          ))}
        </ul>
      )}

      {selected && (
        <div className="modal-back" onClick={() => setSelected(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-icon ${selected.type}`}>
              <CategoryIcon category={selected.category} size={26} />
            </div>
            <h2 className={selected.type}>
              {selected.type === "expense" ? "−" : "+"}
              {money(selected.amount)}
            </h2>
            <dl>
              <dt>Type</dt>
              <dd>{selected.type === "expense" ? "Expense" : "Income"}</dd>
              <dt>Category</dt>
              <dd>{selected.category}</dd>
              <dt>Date</dt>
              <dd>{formatDate(selected.date)}</dd>
              <dt>Description</dt>
              <dd>{selected.description || "None"}</dd>
            </dl>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => navigate(`/transactions/${selected.id}/edit`)}>
                <Pencil size={16} /> Edit
              </button>
              <button className="btn btn-danger" onClick={remove}>
                <Trash2 size={16} /> Delete
              </button>
              <button className="btn" onClick={() => setSelected(null)}>
                <X size={16} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
