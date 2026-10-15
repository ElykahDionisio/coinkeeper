import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="splash">Loading CoinKeeper…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="splash">Loading CoinKeeper…</div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}
