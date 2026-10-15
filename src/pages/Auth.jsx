import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const friendly = (code) =>
  ({
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/email-already-in-use": "An account with this email already exists. Log in instead.",
    "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
    "auth/network-request-failed": "No internet connection. Check your network and try again.",
  }[code] || "Something went wrong. Please try again.");

export default function Auth() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const isLogin = mode === "login";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin) {
      if (form.name.trim().length < 2) return setError("Enter your name.");
      if (form.password !== form.confirm) return setError("Passwords do not match.");
    }
    setBusy(true);
    try {
      if (isLogin) await login(form.email.trim(), form.password);
      else await register(form.name.trim(), form.email.trim(), form.password);
    } catch (err) {
      setError(friendly(err.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-art">
        <Logo big />
        <h1>Know where your money goes.</h1>
        <p>Log income and expenses, set a monthly budget, and see what is left. No notebook needed.</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <h2>{isLogin ? "Log in" : "Create your account"}</h2>
        {error && <p className="alert alert-error">{error}</p>}
        {!isLogin && (
          <label>
            Name
            <input value={form.name} onChange={set("name")} autoComplete="name" required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={set("password")}
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
            required
          />
        </label>
        {!isLogin && (
          <label>
            Confirm password
            <input type="password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" required />
          </label>
        )}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
        </button>
        <p className="switch">
          {isLogin ? "New to CoinKeeper?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="link"
            onClick={() => {
              setMode(isLogin ? "register" : "login");
              setError("");
            }}
          >
            {isLogin ? "Create an account" : "Log in"}
          </button>
        </p>
      </form>
    </div>
  );
}
