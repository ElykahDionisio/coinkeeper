import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ProtectedRoute, PublicOnly } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TransactionForm from "./pages/TransactionForm";
import History from "./pages/History";
import Budget from "./pages/Budget";
import Summary from "./pages/Summary";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Auth />
              </PublicOnly>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <DataProvider>
                  <Layout />
                </DataProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<TransactionForm />} />
            <Route path="transactions/:id/edit" element={<TransactionForm />} />
            <Route path="history" element={<History />} />
            <Route path="budget" element={<Budget />} />
            <Route path="summary" element={<Summary />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
