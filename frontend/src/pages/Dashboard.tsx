import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Product, InventoryLog, SalesReport } from '../types';

const Dashboard: React.FC = () => {
    const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
    const [inventoryHistory, setInventoryHistory] = useState<InventoryLog[]>([]);
    const [lowStock, setLowStock] = useState<Product[]>([]);
    
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [loginAlertItems, setLoginAlertItems] = useState<Product[]>([]);
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, historyRes, lowStockRes] = await Promise.all([
                    api.get('/reports/my-sales'),
                    api.get('/reports/my-inventory-history'),
                    api.get('/reports/my-low-stock')
                ]);
                setSalesReport(salesRes.data);
                setInventoryHistory(historyRes.data);
                setLowStock(lowStockRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };
        fetchData();

        if (location.state?.lowStockAlerts && location.state.lowStockAlerts.length > 0) {
            setLoginAlertItems(location.state.lowStockAlerts);
            setShowLoginAlert(true);
            navigate('.', { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    return (
        <div>
            <h2>My Dashboard</h2>
            <div className="row">
                {/* Regular Dashboard Notifications */}
                <div className="col-md-12 mb-4">
                    <div className="card">
                         <div className="card-header">Notifications</div>
                         <div className="card-body">
                            {lowStock.length > 0 ? lowStock.map(p => (
                                <div key={p._id} className="alert alert-danger p-2 mb-2">
                                    <strong>Low Stock Alert:</strong> {p.name} only has {p.stock_quantity} items left.
                                </div>
                            )) : (<p className="mb-0">No low stock notifications.</p>)}
                         </div>
                    </div>
                </div>
                
                {/* Sales Report Card */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">Sales Report</div>
                        <div className="card-body">
                           <h3 className="card-title">${salesReport?.totalSales?.toFixed(2) || '0.00'}</h3>
                           <p className="card-text">Total sales from {salesReport?.salesDetails?.length || 0} completed orders.</p>
                        </div>
                    </div>
                </div>

                 {/* Inventory History Card */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">Inventory History</div>
                         <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <ul className="list-group list-group-flush">
                                {inventoryHistory.length > 0 ? inventoryHistory.map(log => (
                                    <li key={log._id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className={`badge me-2 bg-${log.type === 'Entrance' ? 'success' : 'danger'}`}>{log.type}</span>
                                            {log.product?.name || 'Deleted Product'}
                                        </div>
                                        <small className="text-muted">
                                            Qty: {log.quantity_change} on {new Date(log.createdAt).toLocaleDateString()}
                                        </small>
                                    </li>
                                )) : <p className="mb-0">No inventory history found.</p>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Alert Modal (this part was already correct) */}
            {showLoginAlert && (
                <div className="modal show" style={{ display: 'block' }} tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Welcome! You have Low Stock Items</h5>
                                <button type="button" className="btn-close" onClick={() => setShowLoginAlert(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>The following items in your inventory are running low:</p>
                                <ul>
                                    {loginAlertItems.map(item => (
                                        <li key={item._id}>
                                            <strong>{item.name}</strong> - {item.stock_quantity} remaining.
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => setShowLoginAlert(false)}>
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showLoginAlert && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Dashboard;