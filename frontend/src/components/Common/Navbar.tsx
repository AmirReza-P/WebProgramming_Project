import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Theme } from '../../theme'; // adjust path if needed

interface NavbarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  theme: Theme;                // ★ NEW
  toggleTheme: () => void;     // ★ NEW
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">StoreTrack</NavLink>

        {/* Hamburger toggler to fix collapse on small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {isAuthenticated ? (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/my-inventory">My Inventory</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/marketplace">Marketplace</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/my-orders">My Orders</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/my-sales">My Sales</NavLink></li>
            </ul>
          ) : (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" />
          )}

          {/* ★ NEW: Theme toggle switch */}
          <div className="d-flex align-items-center gap-3">
            <div className="form-check form-switch text-light m-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="themeSwitch"
                onChange={toggleTheme}
                checked={theme === 'dark'}
                aria-label="Toggle dark mode"
              />
              <label className="form-check-label" htmlFor="themeSwitch">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </label>
            </div>

            {isAuthenticated ? (
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            ) : (
              <div>
                <NavLink className="btn btn-outline-light me-2" to="/login">Login</NavLink>
                <NavLink className="btn btn-light" to="/signup">Sign Up</NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
