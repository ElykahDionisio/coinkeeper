import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, CirclePlus, History, Target, ChartPie, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Avatar from "./Avatar";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/transactions", label: "Add", Icon: CirclePlus },
  { to: "/history", label: "History", Icon: History },
  { to: "/budget", label: "Budget", Icon: Target },
  { to: "/summary", label: "Summary", Icon: ChartPie },
  { to: "/profile", label: "Profile", Icon: User },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { error } = useData();

  return (
    <div className="app">
      <aside className="sidebar">
        <Logo />
        <nav>
          {links.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-user">
          <Avatar user={user} size={38} />
          <div className="side-user-info">
            <strong>{user.displayName || "You"}</strong>
            <small>{user.email}</small>
          </div>
          <button className="icon-btn" onClick={logout} aria-label="Log out" title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main>
        {error && (
          <p className="alert alert-error">
            Could not load your data: {error}. Check that your database rules are published.
          </p>
        )}
        <Outlet />
      </main>
    </div>
  );
}
