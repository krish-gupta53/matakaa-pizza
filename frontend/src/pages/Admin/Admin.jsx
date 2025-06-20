import React, { useState, useEffect } from 'react';
import './Admin.css';
import Sidebar from './Sidebar/Sidebar';
import Add from './Add/Add';
import List from './List/List';
import Orders from './Orders/Orders';
import PromoCode from './PromoCode/PromoCode';
import Settings from './Settings/Settings';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const Admin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalFoods: 0,
        totalUsers: 0
    });
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/admin/stats', {
                headers: {
                    'token': localStorage.getItem('token')
                }
            });
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            toast.error('Failed to fetch stats');
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const renderComponent = () => {
        const path = location.pathname;
        if (path.includes('/admin/add')) return <Add />;
        if (path.includes('/admin/list')) return <List />;
        if (path.includes('/admin/orders')) return <Orders />;
        if (path.includes('/admin/promocodes')) return <PromoCode />;
        if (path.includes('/admin/settings')) return <Settings/>;
        
        // Dashboard view
        return (
            <div className="dashboard">
                <div className="stats-container">
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>{stats.totalOrders}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p>₹{stats.totalRevenue}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Foods</h3>
                        <p>{stats.totalFoods}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p>{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button onClick={() => navigate('/admin/add')}>
                            Add New Food
                        </button>
                        <button onClick={() => navigate('/admin/list')}>
                            Manage Foods
                        </button>
                        <button onClick={() => navigate('/admin/orders')}>
                            View Orders
                        </button>
                        <button onClick={() => navigate('/admin/promocodes')}>
                            Manage Promos
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-container">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="admin-content">
                <div className="admin-header">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <h1>Admin Dashboard</h1>
                </div>
                {renderComponent()}
            </div>
        </div>
    );
};

export default Admin; 