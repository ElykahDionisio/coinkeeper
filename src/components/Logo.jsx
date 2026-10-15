import { Coins } from "lucide-react";

export default function Logo({ big = false }) {
  return (
    <div className={`brand ${big ? "brand-big" : ""}`}>
      <span className="brand-mark">
        <Coins size={big ? 24 : 20} strokeWidth={2.2} aria-hidden="true" />
      </span>
      CoinKeeper
    </div>
  );
}
