import { formatDate, money } from "../utils";
import CategoryIcon from "./CategoryIcon";

export default function TransactionItem({ t, onClick }) {
  return (
    <li className={`tx ${onClick ? "tx-click" : ""}`}>
      <button type="button" onClick={onClick} disabled={!onClick}>
        <span className={`tx-icon ${t.type}`}>
          <CategoryIcon category={t.category} />
        </span>
        <span className="tx-main">
          <strong>{t.description || t.category}</strong>
          <small>{t.category}</small>
        </span>
        <span className="tx-right">
          <span className={`tx-amt ${t.type}`}>
            {t.type === "expense" ? "−" : "+"}
            {money(t.amount)}
          </span>
          <small>{formatDate(t.date)}</small>
        </span>
      </button>
    </li>
  );
}
