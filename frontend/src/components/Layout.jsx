import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-dot">LF</span>
          <span>Campus Lost & Found</span>
        </Link>

        <nav className="topnav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">Why This Site</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {user && <NavLink to="/items/new">Post Item</NavLink>}
          {user?.isAdmin && <NavLink to="/admin/login-logs">Admin</NavLink>}
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && (
            <Link className="btn btn-primary" to="/signup">
              Sign Up
            </Link>
          )}
          {user && (
            <button className="btn btn-muted" onClick={logout} type="button">
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="page-wrap">{children}</main>
    </div>
  );
}
