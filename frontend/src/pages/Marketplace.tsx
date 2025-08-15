import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Product, CartItem } from '../types';

const Marketplace: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        const res = await api.get('/marketplace/products');
        setProducts(res.data);
        setFilteredProducts(res.data);
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

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                // If item exists, increase quantity by 1, respecting stock limit
                const newQuantity = existingItem.quantity + 1;
                return prevCart.map(item => 
                    item._id === product._id ? { ...item, quantity: Math.min(newQuantity, product.stock_quantity) } : item
                );
            }
            // If item doesn't exist, add it to cart with quantity 1
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };
    
    // FUNCTION TO HANDLE CART QUANTITY CHANGE ***
    const handleQuantityChange = (productId: string, newQuantity: number) => {
        const productInStock = products.find(p => p._id === productId);
        if (!productInStock) return;

        // Ensure quantity is not negative or greater than stock
        const validatedQuantity = Math.max(1, Math.min(newQuantity, productInStock.stock_quantity));

        setCart(prevCart => prevCart.map(item =>
            item._id === productId ? { ...item, quantity: validatedQuantity } : item
        ));
    };

    // FUNCTION TO REMOVE ITEM FROM CART ***
    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        try {
            const orderPayload = {
                cartItems: cart.map(item => ({ productId: item._id, quantity: item.quantity }))
            };
            await api.post('/orders', orderPayload);
            alert('Order placed successfully!');
            setCart([]);
            // REFRESH PRODUCT LIST AFTER CHECKOUT ***
            fetchProducts();
        } catch (error: any) {
            alert(`Failed to place order: ${error.response?.data?.msg || 'Server error'}`);
        }
    };

    return (
        <div className="row">
            <div className="col-md-8">
                <h2>Marketplace</h2>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by name or category..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="row">
                    {filteredProducts.map(p => (
                        <div key={p._id} className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{p.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{p.category}</h6>
                                    <p className="card-text">Price: ${p.price.toFixed(2)}</p>
                                    <p className="card-text">In Stock: {p.stock_quantity}</p>
                                    <div className="mt-auto">
                                        <button className="btn btn-primary w-100" onClick={() => addToCart(p)} disabled={p.stock_quantity === 0}>
                                            {p.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-md-4">
                <h3>Shopping Cart</h3>
                <div className="card">
                    <ul className="list-group list-group-flush">
                        {cart.length === 0 ? (
                             <li className="list-group-item">Your cart is empty.</li>
                        ) : (
                            cart.map(item => (
                                <li key={item._id} className="list-group-item d-flex flex-column">
                                    <div><strong>{item.name}</strong></div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        {/* QUANTITY INPUT AND REMOVE BUTTON *** */}
                                        <input 
                                            type="number" 
                                            className="form-control form-control-sm me-2" 
                                            style={{ width: '70px' }}
                                            value={item.quantity}
                                            min="1"
                                            max={item.stock_quantity}
                                            onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                                        />
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>X</button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                    {cart.length > 0 && (
                        <div className="card-body">
                            <h5>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</h5>
                            <button className="btn btn-accent w-100" onClick={handleCheckout}>Checkout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;