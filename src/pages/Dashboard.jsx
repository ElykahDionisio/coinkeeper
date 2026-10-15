import { Link } from "react-router-dom";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import BudgetRing from "../components/BudgetRing";
import TransactionItem from "../components/TransactionItem";
import { money, sum, today } from "../utils";

export default function Dashboard() {
  const { user } = useAuth();
  const { transactions, budget, loading } = useData();

  if (loading) return <p className="muted">Loading your records…</p>;

  const income = sum(transactions.filter((t) => t.type === "income"));
  const expenses = sum(transactions.filter((t) => t.type === "expense"));
  const month = today().slice(0, 7);
  const spentThisMonth = sum(transactions.filter((t) => t.type === "expense" && t.date.startsWith(month)));
  const first = (user.displayName || "there").split(" ")[0];

  return (
    <>
      <header className="page-head">
        <h1>Hi, {first}</h1>
        <Link className="btn btn-gold" to="/transactions">
          <Plus size={18} /> Add transaction
        </Link>
      </header>

      <section className="hero">
        <div className="hero-main">
          <span>Balance left</span>
          <strong className={income - expenses < 0 ? "neg" : ""}>{money(income - expenses)}</strong>
          <div className="hero-split">
            <div>
              <span><TrendingUp size={14} /> Total income</span>
              <b className="pos">{money(income)}</b>
            </div>
            <div>
              <span><TrendingDown size={14} /> Total expenses</span>
              <b className="neg-soft">{money(expenses)}</b>
            </div>
          </div>
        </div>
        <div className="hero-ring">
          <BudgetRing spent={spentThisMonth} budget={budget} />
          <p>
            {budget > 0 ? (
              <>
                Spent {money(spentThisMonth)} of {money(budget)} this month
              </>
            ) : (
              <Link to="/budget">Set a monthly budget</Link>
            )}
          </p>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Recent transactions</h2>
          <Link to="/history">See all</Link>
        </div>
        {transactions.length === 0 ? (
          <div className="empty">
            <p>No transactions yet. Add your first expense or income to get started.</p>
            <Link className="btn btn-primary" to="/transactions">
              Add transaction
            </Link>
          </div>
        ) : (
          <ul className="tx-list">
            {transactions.slice(0, 5).map((t) => (
              <TransactionItem key={t.id} t={t} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
