import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Order } from '../types';

const MySales: React.FC = () => {
    // ... (logic remains the same)
    const [sales, setSales] = useState<Order[]>([]);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        const res = await api.get('/orders/received');
        setSales(res.data);
    };

    const handleStatusUpdate = async (orderId: string, status: 'Shipped' | 'Canceled') => {
        await api.put(`/orders/received/${orderId}`, { status });
        fetchSales();
    };

    // *** NEW: HELPER FUNCTION FOR STATUS BADGE CLASS ***
    const getStatusClass = (status: 'Pending' | 'Shipped' | 'Canceled') => {
        switch (status) {
            case 'Shipped': return 'bg-success';
            case 'Canceled': return 'bg-danger';
            default: return 'bg-warning text-dark';
        }
    };

    return (
        <div>
            <h2>My Sales (Products I've Sold)</h2>
            {sales.map(order => (
                <div key={order._id} className="card mb-3">
                    <div className="card-header d-flex justify-content-between">
                        <span>Order ID: {order._id}</span>
                        <span>Status: <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span></span>
                    </div>
                     {/* ... (rest of the component is the same) ... */}
                     <div className="card-body">
                        <p><strong>Buyer:</strong> {order.buyer?.username || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                        <h6>Items:</h6>
                        <ul className="list-group mb-3">
                            {order.products.map(item => (
                                <li key={item.productId} className="list-group-item">
                                    {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                        {order.status === 'Pending' && (
                            <div>
                                <button className="btn btn-success me-2" onClick={() => handleStatusUpdate(order._id, 'Shipped')}>Mark as Shipped</button>
                                <button className="btn btn-danger" onClick={() => handleStatusUpdate(order._id, 'Canceled')}>Cancel Order</button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MySales;