import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        <button className="menu-toggle" type="button" onClick={() => setMobileMenuOpen((v) => !v)}>
          Menu
        </button>

        <nav className={`topnav ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={navClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/browse" className={navClass} onClick={() => setMobileMenuOpen(false)}>Browse Items</NavLink>
          {!user && (
            <NavLink to="/login" className="nav-button nav-button-gold" onClick={() => setMobileMenuOpen(false)}>
              Login
            </NavLink>
          )}
          {!user && (
            <NavLink to="/signup" className="nav-button nav-button-gold" onClick={() => setMobileMenuOpen(false)}>
              Signup
            </NavLink>
          )}

          {user && <NavLink to="/report/lost" className={navClass} onClick={() => setMobileMenuOpen(false)}>Report Lost Item</NavLink>}
          {user && <NavLink to="/report/found" className={navClass} onClick={() => setMobileMenuOpen(false)}>Report Found Item</NavLink>}
          {user && <NavLink to="/my-posts" className={navClass} onClick={() => setMobileMenuOpen(false)}>My Posts</NavLink>}
          {user?.isAdmin && <NavLink to="/admin/login-logs" className={navClass} onClick={() => setMobileMenuOpen(false)}>Admin</NavLink>}

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
          <p>Classic campus platform for secure lost and found recovery.</p>
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

      <div className="footer-note">
        <span>Built for students, staff, and quick item recovery.</span>
        <span>Responsive. Account-based. Simple to use.</span>
      </div>
    </div>
  );
}
