export const EXPENSE_CATEGORIES = ["Food", "Transportation", "School", "Bills", "Other"];
export const INCOME_CATEGORIES = ["Allowance", "Salary", "Other income"];

export const CATEGORY_COLORS = {
  Food: "#f0b323",
  Transportation: "#7b1220",
  School: "#2f6f8f",
  Bills: "#c9722b",
  Other: "#8a8f98",
};

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
export const money = (n) => peso.format(Number(n) || 0);

// Today's date in the user's local timezone, formatted YYYY-MM-DD
export const today = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export const formatDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const sum = (list) => list.reduce((total, t) => total + Number(t.amount), 0);
