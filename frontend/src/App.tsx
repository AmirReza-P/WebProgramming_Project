import React, { useState, useEffect, JSX } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyInventory from './pages/MyInventory';
import Marketplace from './pages/Marketplace';
import MyOrders from './pages/MyOrders';
import MySales from './pages/MySales';
import Dashboard from './pages/Dashboard';
import { getInitialTheme, applyTheme, Theme } from './theme';

// A wrapper for routes that require the user to be logged in
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

    // This effect helps the Navbar update when the auth state changes
    useEffect(() => {
        const handleStorageChange = () => {
        setIsAuthenticated(!!localStorage.getItem('token'));
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored === 'light' || stored === 'dark') setTheme(stored);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));


    return (
        <Router>
            <Navbar
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                theme={theme}                 
                toggleTheme={toggleTheme}     
            />
            <main className="container mt-4">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected Routes */}
                    <Route path="/my-inventory" element={<PrivateRoute><MyInventory /></PrivateRoute>} />
                    <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
                    <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
                    <Route path="/my-sales" element={<PrivateRoute><MySales /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

                    {/* Default route */}
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;