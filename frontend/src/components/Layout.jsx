import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);

  function navClass({ isActive }) {
    return isActive ? 'nav-link active' : 'nav-link';
  }

  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-dot">LF</span>
          <span>Campus Lost & Found</span>
        </Link>

        <nav className="topnav">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/browse" className={navClass}>Browse Items</NavLink>
          {!user && (
            <NavLink to="/login" className="nav-button nav-button-gold">
              Login
            </NavLink>
          )}
          {!user && (
            <NavLink to="/signup" className="nav-button nav-button-gold">
              Signup
            </NavLink>
          )}

          {user && <NavLink to="/report/lost" className={navClass}>Report Lost Item</NavLink>}
          {user && <NavLink to="/report/found" className={navClass}>Report Found Item</NavLink>}
          {user && <NavLink to="/my-posts" className={navClass}>My Posts</NavLink>}
          {user?.isAdmin && <NavLink to="/admin/login-logs" className={navClass}>Admin</NavLink>}

          {user && (
            <div className="profile-wrap">
              <button className="btn btn-gold" type="button" onClick={() => setOpenProfile((v) => !v)}>
                {user.name.split(' ')[0]}
              </button>
              {openProfile && (
                <div className="profile-menu">
                  <p>{user.name}</p>
                  <small>{user.email}</small>
                  <button className="btn btn-muted" onClick={logout} type="button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      <main className="page-wrap">{children}</main>

      <footer className="site-footer">
        <div>
          <h4>About</h4>
          <p> Lost and Found platform for daily college use.</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: piyushkumar841222@gmail.com</p>
        </div>
        <div>
          <h4>College</h4>
          <p>Campus Lost and Found Project</p>
        </div>
        <div>
          <h4>Copyright</h4>
          <p>© {new Date().getFullYear()} Campus Lost & Found</p>
        </div>
      </footer>
    </div>
  );
}
