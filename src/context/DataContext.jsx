import { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const txRef = ref(db, `users/${user.uid}/transactions`);
    const budgetRef = ref(db, `users/${user.uid}/budget/monthly`);
    let txReady = false;
    let budgetReady = false;
    const finish = () => txReady && budgetReady && setLoading(false);

    const offTx = onValue(
      txRef,
      (snap) => {
        const val = snap.val() || {};
        const list = Object.entries(val)
          .map(([id, t]) => ({ id, ...t }))
          .sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
        setTransactions(list);
        txReady = true;
        finish();
      },
      (err) => {
        setError(err.message);
        txReady = true;
        finish();
      }
    );

    const offBudget = onValue(
      budgetRef,
      (snap) => {
        setBudget(Number(snap.val()) || 0);
        budgetReady = true;
        finish();
      },
      (err) => {
        setError(err.message);
        budgetReady = true;
        finish();
      }
    );

    return () => {
      offTx();
      offBudget();
    };
  }, [user.uid]);

  const base = `users/${user.uid}`;

  const addTransaction = (data) =>
    push(ref(db, `${base}/transactions`), { ...data, createdAt: Date.now() });
  const updateTransaction = (id, data) => update(ref(db, `${base}/transactions/${id}`), data);
  const deleteTransaction = (id) => remove(ref(db, `${base}/transactions/${id}`));
  const saveBudget = (amount) => set(ref(db, `${base}/budget/monthly`), Number(amount));
  const clearBudget = () => remove(ref(db, `${base}/budget/monthly`));

  return (
    <DataContext.Provider
      value={{
        transactions,
        budget,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveBudget,
        clearBudget,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
