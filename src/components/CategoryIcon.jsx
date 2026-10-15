import { Utensils, Bus, GraduationCap, Lightbulb, Shapes, Wallet, Briefcase, CircleDollarSign } from "lucide-react";

const ICONS = {
  Food: Utensils,
  Transportation: Bus,
  School: GraduationCap,
  Bills: Lightbulb,
  Other: Shapes,
  Allowance: Wallet,
  Salary: Briefcase,
  "Other income": CircleDollarSign,
};

export default function CategoryIcon({ category, size = 20 }) {
  const Icon = ICONS[category] || Shapes;
  return <Icon size={size} strokeWidth={2} aria-hidden="true" />;
}
