import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

interface LoginProps {
    setIsAuthenticated: (isAuth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', formData);
            const token = response.data.token;
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            window.dispatchEvent(new Event("storage"));

            // Fetch low stock alerts before navigating ***
            const lowStockResponse = await api.get('/reports/my-low-stock', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const lowStockItems = lowStockResponse.data;
            
            // Navigate to dashboard with state containing the alerts ***
            navigate('/dashboard', { state: { lowStockAlerts: lowStockItems } });

        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to login.');
        }
    };

    return (
         <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title text-center">Login</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                           <div className="mb-3"><label>Email</label><input type="email" name="email" className="form-control" onChange={handleChange} required /></div>
                           <div className="mb-3"><label>Password</label><input type="password" name="password" className="form-control" onChange={handleChange} required /></div>
                           <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;