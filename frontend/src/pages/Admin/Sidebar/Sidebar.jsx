import React from 'react';
import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaPlus, FaList, FaTags, FaCog, FaSignOutAlt, FaTimes, FaGift, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    const getCurrentComponent = () => {
        const path = location.pathname;
        if (path.includes('/admin/add')) return 'add';
        if (path.includes('/admin/list')) return 'list';
        if (path.includes('/admin/orders')) return 'orders';
        if (path.includes('/admin/promocodes')) return 'promocodes';
        if (path.includes('/admin/settings')) return 'settings';
        if (path.includes('/admin/delivery-boys')) return 'delivery-boys';
        return 'dashboard';
    };

    const currentComponent = getCurrentComponent();

    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="sidebar-section">
                    <h3>Main</h3>
                    <ul className="sidebar-list">
                        <li 
                            className={`sidebar-list-item ${currentComponent === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin')}
                        >
                            <FaHome className="sidebar-icon" />
                            <span>Dashboard</span>
                        </li>
                        <li 
                            className={`sidebar-list-item ${currentComponent === 'add' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/add')}
                        >
                            <FaPlus className="sidebar-icon" />
                            <span>Add Food</span>
                        </li>
                        <li 
                            className={`sidebar-list-item ${currentComponent === 'list' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/list')}
                        >
                            <FaList className="sidebar-icon" />
                            <span>Food List</span>
                        </li>
                        <li 
                            className={`sidebar-list-item ${currentComponent === 'orders' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/orders')}
                        >
                            <FaShoppingCart className="sidebar-icon" />
                            <span>Orders</span>
                        </li>
                    </ul>
                </div>

                <div className="sidebar-section">
                    <h3>Management</h3>
                    <ul className="sidebar-list">
                        <li 
                            className={`sidebar-list-item ${currentComponent === 'promocodes' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/promocodes')}
                        >
                            <FaGift className="sidebar-icon" />
                            <span>Promo Codes</span>
                        </li>
                        <li 
                            className={`sidebar-list-item ${currentComponent === 'delivery-boys' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/delivery-boys')}
                        >
                            <FaTruck className="sidebar-icon" />
                            <span>Delivery Boys</span>
                        </li>
                    </ul>
                </div>

                <div className="sidebar-section">
                    <h3>Settings</h3>
                    <ul className="sidebar-list">
                        <li 
                            className={`sidebar-list-item ${currentComponent === 'settings' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/settings')}
                        >
                            <FaCog className="sidebar-icon" />
                            <span>System Settings</span>
                        </li>
                        <li 
                            className="sidebar-list-item"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="sidebar-icon" />
                            <span>Logout</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;