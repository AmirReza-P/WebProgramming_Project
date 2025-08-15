import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Product } from '../types';

const MyInventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ name: '', stock_quantity: 0, price: 0, category: '' });

    const fetchProducts = async () => {
        try {
            const res = await api.get('/inventory/my-products');
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const results = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);

    const lowStockItems = products.filter(p => p.stock_quantity < 6);

    const handleClose = () => {
        setShowModal(false);
        setEditingProduct(null);
    };
    
    const handleShow = (product: Product | null = null) => {
        setEditingProduct(product);
        setFormData(product ? { ...product } : { name: '', stock_quantity: 0, price: 0, category: '' });
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Number(formData.price) <= 0) {
            alert('Price must be greater than zero.');
            return;
        }
        if (editingProduct) {
            await api.put(`/inventory/my-products/${editingProduct._id}`, formData);
        } else {
            await api.post('/inventory/my-products', formData);
        }
        fetchProducts();
        handleClose();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await api.delete(`/inventory/my-products/${id}`);
            fetchProducts();
        }
    };

    return (
        <div>
            {lowStockItems.length > 0 && (
                <div className="alert alert-warning mb-4">
                    <h4 className="alert-heading">Low Stock Alerts!</h4>
                    <p>The following items have a stock quantity below 6:</p>
                    <hr />
                    <ul>
                        {lowStockItems.map(item => (
                            <li key={item._id}><strong>{item.name}</strong> - {item.stock_quantity} items left.</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Inventory</h2>
                <button className="btn btn-accent" onClick={() => handleShow()}>Add New Product</button>
            </div>
            
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <table className="table table-hover">
                <thead>
                    <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p._id}>
                            <td>{p.name}</td><td>{p.category}</td><td>${p.price.toFixed(2)}</td>
                            <td><span className={p.stock_quantity < 6 ? 'stock-badge stock-low' : 'stock-badge stock-ok'}>{p.stock_quantity}</span></td>
                            <td>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => handleShow(p)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {showModal && (
                <div className="modal show" style={{ display: 'block' }} tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Price</label>
                                        <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Stock Quantity</label>
                                        <input type="number" name="stock_quantity" className="form-control" value={formData.stock_quantity} onChange={handleChange} required min="0" />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* This is the backdrop that darkens the background */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default MyInventory;