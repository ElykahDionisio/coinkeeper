import { money } from "../utils";

// The "coin ring": shows how much of the monthly budget is used.
export default function BudgetRing({ spent, budget }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const ratio = budget > 0 ? spent / budget : 0;
  const filled = Math.min(ratio, 1) * circumference;
  const state = ratio > 1 ? "over" : ratio >= 0.8 ? "warn" : "ok";
  const left = budget - spent;

  return (
    <div className={`ring ring-${state}`}>
      <svg viewBox="0 0 160 160" role="img" aria-label={`${Math.round(ratio * 100)} percent of budget used`}>
        <circle className="ring-track" cx="80" cy="80" r={radius} />
        <circle
          className="ring-fill"
          cx="80"
          cy="80"
          r={radius}
          strokeDasharray={`${filled} ${circumference}`}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="ring-text">
        {budget > 0 ? (
          <>
            <strong>{Math.round(ratio * 100)}%</strong>
            <span>{left >= 0 ? `${money(left)} left` : `${money(-left)} over`}</span>
          </>
        ) : (
          <span>No budget set</span>
        )}
      </div>
    </div>
  );
}
