import React, { useState, useEffect } from 'react';
import './Settings.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Settings = () => {
    const [settings, setSettings] = useState({
        isOrderEnabled: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/settings', {
                headers: {
                    'token': localStorage.getItem('token')
                }
            });
            
            if (response.data.success) {
                setSettings(response.data.data);
            } else {
                toast.error(response.data.message || 'Failed to fetch settings');
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async () => {
        try {
            setLoading(true);
            const response = await axios.put('/api/settings', 
                { isOrderEnabled: !settings.isOrderEnabled },
                {
                    headers: {
                        'token': localStorage.getItem('token')
                    }
                }
            );

            if (response.data.success) {
                setSettings(prev => ({
                    ...prev,
                    isOrderEnabled: !prev.isOrderEnabled
                }));
                toast.success(`Order system ${!settings.isOrderEnabled ? 'enabled' : 'disabled'} successfully!`);
            } else {
                toast.error(response.data.message || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2>System Settings</h2>
            </div>

            <div className="settings-content">
                <div className="settings-card">
                    <div className="settings-item">
                        <div className="settings-info">
                            <h3>Order System</h3>
                            <p>Enable or disable the order system for customers</p>
                        </div>
                        <div className="settings-action">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.isOrderEnabled}
                                    onChange={handleToggle}
                                    disabled={loading}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="status-text">
                                {settings.isOrderEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 