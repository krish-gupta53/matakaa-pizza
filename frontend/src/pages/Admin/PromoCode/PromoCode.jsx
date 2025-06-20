import React, { useState, useEffect } from 'react';
import './PromoCode.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const PromoCode = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '',
        isActive: true,
        validUntil: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/promo/admin', {
                headers: {
                    'token': localStorage.getItem('token')
                }
            });
            
            if (response.data.success) {
                setPromoCodes(response.data.data);
            } else {
                toast.error(response.data.message || 'Failed to fetch promo codes');
            }
        } catch (error) {
            console.error('Error fetching promo codes:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch promo codes');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate form data
            if (!formData.code || !formData.description || !formData.discountValue || !formData.minOrderAmount || !formData.validUntil) {
                toast.error('Please fill in all required fields');
                setLoading(false);
                return;
            }

            // Convert the form data to match backend requirements
            const dataToSend = {
                ...formData,
                code: formData.code.toUpperCase(),
                discountValue: Number(formData.discountValue),
                minOrderAmount: Number(formData.minOrderAmount)
            };

            const response = await axios.post('/api/promo/admin', dataToSend, {
                headers: {
                    'token': localStorage.getItem('token')
                }
            });

            if (response.data.success) {
                toast.success('Promo code added successfully!');
                setFormData({
                    code: '',
                    description: '',
                    discountType: 'PERCENTAGE',
                    discountValue: '',
                    minOrderAmount: '',
                    isActive: true,
                    validUntil: ''
                });
                fetchPromoCodes();
            } else {
                toast.error(response.data.message || 'Failed to add promo code');
            }
        } catch (error) {
            console.error('Error adding promo code:', error);
            toast.error(error.response?.data?.message || 'Failed to add promo code');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this promo code?')) {
            try {
                setLoading(true);
                const response = await axios.delete(`/api/promo/admin/${id}`, {
                    headers: {
                        'token': localStorage.getItem('token')
                    }
                });

                if (response.data.success) {
                    toast.success('Promo code deleted successfully!');
                    fetchPromoCodes();
                } else {
                    toast.error(response.data.message || 'Failed to delete promo code');
                }
            } catch (error) {
                console.error('Error deleting promo code:', error);
                toast.error(error.response?.data?.message || 'Failed to delete promo code');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="promo-code-container">
            <div className="promo-code-header">
                <h2>Manage Promo Codes</h2>
            </div>

            <div className="add-promo-section">
                <h3>Add New Promo Code</h3>
                <form className="promo-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="code">Promo Code *</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter promo code"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter promo code description"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="discountType">Discount Type *</label>
                        <select
                            id="discountType"
                            name="discountType"
                            value={formData.discountType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="FLAT">Fixed Amount</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="discountValue">
                            Discount Value {formData.discountType === 'PERCENTAGE' ? '(%)' : '(₹)'} *
                        </label>
                        <input
                            type="number"
                            id="discountValue"
                            name="discountValue"
                            value={formData.discountValue}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step={formData.discountType === 'PERCENTAGE' ? "1" : "0.01"}
                            placeholder={`Enter discount ${formData.discountType === 'PERCENTAGE' ? 'percentage' : 'amount'}`}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="minOrderAmount">Minimum Order Amount (₹) *</label>
                        <input
                            type="number"
                            id="minOrderAmount"
                            name="minOrderAmount"
                            value={formData.minOrderAmount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="Enter minimum order amount"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="validUntil">Valid Until *</label>
                        <input
                            type="datetime-local"
                            id="validUntil"
                            name="validUntil"
                            value={formData.validUntil}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                            />
                            Active
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Promo Code'}
                    </button>
                </form>
            </div>

            <div className="promo-list-section">
                <h3>Existing Promo Codes</h3>
                <div className="promo-list">
                    {promoCodes.map(promo => (
                        <div key={promo._id} className="promo-card">
                            <div className="promo-details">
                                <h4>{promo.code}</h4>
                                <p>{promo.description}</p>
                                <div className="promo-info">
                                    <span className={`discount-type ${promo.discountType}`}>
                                        {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `₹${promo.discountValue}`}
                                    </span>
                                    <span className="min-order">
                                        Min: ₹{promo.minOrderAmount}
                                    </span>
                                    <span className={`status ${promo.isActive ? 'active' : 'inactive'}`}>
                                        {promo.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="validity">
                                    Valid until: {new Date(promo.validUntil).toLocaleString()}
                                </div>
                            </div>
                            <div className="promo-actions">
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(promo._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PromoCode;