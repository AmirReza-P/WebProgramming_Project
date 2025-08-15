import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Order } from '../types';

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // *** NEW ***
    const [searchTerm, setSearchTerm] = useState(''); // *** NEW ***

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await api.get('/orders/placed');
            setOrders(res.data);
            setFilteredOrders(res.data); // Initialize filtered list
        };
        fetchOrders();
    }, []);

    // useEffect for searching ***
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredOrders(orders);
        } else {
            const results = orders.filter(order =>
                // Check if any product in the order matches the search term
                order.products.some(p =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredOrders(results);
        }
    }, [searchTerm, orders]);

    const getStatusClass = (status: 'Pending' | 'Shipped' | 'Canceled') => {
        switch (status) {
            case 'Shipped': return 'bg-success';
            case 'Canceled': return 'bg-danger';
            default: return 'bg-warning text-dark';
        }
    };

    return (
        <div>
            <h2>My Orders (Products I've Bought)</h2>

            {/* SEARCH INPUT FIELD *** */}
            <input
                type="text"
                className="form-control my-3"
                placeholder="Search by product name in your orders..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            
            {/* Map over filteredOrders *** */}
            {filteredOrders.map(order => (
                <div key={order._id} className="card mb-3">
                    <div className="card-header d-flex justify-content-between">
                        <span>Order ID: {order._id}</span>
                        <span>Status: <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span></span>
                    </div>
                    <div className="card-body">
                        <p><strong>Seller:</strong> {order.seller?.username || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                        <h6>Items:</h6>
                        <ul className="list-group">
                            {order.products.map(item => (
                                <li key={item.productId} className="list-group-item">
                                    {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyOrders;