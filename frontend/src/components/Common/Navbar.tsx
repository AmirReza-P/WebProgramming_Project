import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface NavbarProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuth: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("storage"));
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark"> {/* Changed to navbar-dark for better contrast */}
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">StoreTrack</NavLink>
                <div className="collapse navbar-collapse">
                    {isAuthenticated ? (
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/my-inventory">My Inventory</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/marketplace">Marketplace</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/my-orders">My Orders</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/my-sales">My Sales</NavLink></li>
                        </ul>
                    ) : (
                         <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                    )}
                    {isAuthenticated ? (
                         // *** CHANGED: btn-outline-danger to btn-danger for a solid red button ***
                         <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    ) : (
                        <div>
                           <NavLink className="btn btn-outline-light me-2" to="/login">Login</NavLink>
                           <NavLink className="btn btn-light" to="/signup">Sign Up</NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;