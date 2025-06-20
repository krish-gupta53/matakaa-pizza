import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/order/admin', {
                headers: {
                    'token': localStorage.getItem('token')
                }
            });
            
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error(response.data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await axios.post('/api/order/admin/status', 
                { orderId, status: newStatus },
                {
                    headers: {
                        'token': localStorage.getItem('token')
                    }
                }
            );

            if (response.data.success) {
                toast.success('Order status updated successfully!');
                fetchOrders();
            } else {
                toast.error(response.data.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error(error.response?.data?.message || 'Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#ffd700';
            case 'processing':
                return '#1e90ff';
            case 'out_for_delivery':
                return '#ff6b6b';
            case 'delivered':
                return '#2ecc71';
            default:
                return '#95a5a6';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="orders-container">
                <div className="loading">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h2>Manage Orders</h2>
                <button 
                    className="refresh-btn"
                    onClick={fetchOrders}
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>

            <div className="orders-list">
                {orders.length === 0 ? (
                    <div className="no-orders">No orders found</div>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <h3>Order #{order._id.slice(-6)}</h3>
                                <span className={`status ${order.status}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-details">
                                <div className="customer-info">
                                    <h4>Customer Details</h4>
                                    <p>Name: {order.userId?.name || 'N/A'}</p>
                                    <p>Email: {order.userId?.email || 'N/A'}</p>
                                </div>

                                <div className="delivery-info">
                                    <h4>Delivery Address</h4>
                                    <p>{order.address?.street || 'N/A'}</p>
                                    <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                                </div>

                                <div className="items-info">
                                    <h4>Order Items</h4>
                                    {order.items?.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <span>{item.name}</span>
                                            <span>x{item.quantity}</span>
                                            <span>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-summary">
                                    <div className="summary-item">
                                        <span>Subtotal:</span>
                                        <span>₹{order.amount}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Delivery Charge:</span>
                                        <span>₹50</span>
                                    </div>
                                    <div className="summary-item total">
                                        <span>Total:</span>
                                        <span>₹{order.amount + 50}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="order-actions">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders; 