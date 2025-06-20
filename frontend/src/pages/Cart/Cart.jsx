import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
    const { getTotalCartAmount, cartItems, food_list, removeFromCart, url, token, loadCartData } = useContext(StoreContext);
    const navigate = useNavigate();
    const [promoCodes, setPromoCodes] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [isPromoLoading, setIsPromoLoading] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState(null);

    useEffect(() => {
        loadCartData();
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const response = await axios.get(`${url}/api/promo`);
            setPromoCodes(response.data.data);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
            toast.error('Failed to load promo codes');
        }
    };

    const handlePromoCodeSubmit = async (e) => {
        e.preventDefault();
        if (!promoCode.trim()) {
            toast.error('Please enter a promo code');
            return;
        }

        if (appliedPromo) {
            toast.error('Please remove the current promo code before applying a new one');
            return;
        }

        const orderAmount = subtotal + deliveryFee;
        if (orderAmount === 0) {
            toast.error('Add items to cart before applying promo code');
            return;
        }

        try {
            setIsPromoLoading(true);
            const response = await axios.post(`${url}/api/promo/validate`, {
                code: promoCode.toUpperCase(),
                orderAmount: orderAmount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const promoData = response.data.data;
                setAppliedPromo({
                    code: promoData.code,
                    discountType: promoData.discountType,
                    discountValue: promoData.discount,
                    description: promoData.description,
                    minOrderAmount: promoData.minOrderAmount
                });
                setPromoCode('');
                toast.success('Promo code applied successfully!');
            }
        } catch (error) {
            console.error('Error applying promo code:', error);
            toast.error(error.response?.data?.message || 'Failed to apply promo code');
        } finally {
            setIsPromoLoading(false);
        }
    };

    const removePromoCode = () => {
        setAppliedPromo(null);
        toast.info('Promo code removed');
    };

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 0 ? 40 : 0;
    const discount = appliedPromo ? (
        appliedPromo.discountType === 'PERCENTAGE' 
            ? Math.round((subtotal + deliveryFee) * appliedPromo.discountValue / 100)
            : Math.min(appliedPromo.discountValue, subtotal + deliveryFee)
    ) : 0;
    const total = subtotal + deliveryFee - discount;

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <p>Your cart is empty</p>
                        <button onClick={() => navigate('/')}>Continue Shopping</button>
                    </div>
                ) : (
                    food_list.map((item, index) => {
                        if (cartItems[item._id] > 0) {
                            return (
                                <div key={index}>
                                    <div className="cart-items-title cart-items-item">
                                        <img src={`${url}/uploads/${item.image}`} alt={item.name} />
                                        <p>{item.name}</p>
                                        <p>₹{item.price}</p>
                                        <p>{cartItems[item._id]}</p>
                                        <p>₹{item.price * cartItems[item._id]}</p>
                                        <p onClick={() => removeFromCart(item._id)} className="cross">x</p>
                                    </div>
                                    <hr />
                                </div>
                            );
                        }
                        return null;
                    })
                )}
            </div>

            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>₹{subtotal}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>₹{deliveryFee}</p>
                        </div>
                        <hr />
                        {appliedPromo && (
                            <>
                                <div className="cart-total-details discount-row">
                                    <p>Discount {appliedPromo.discountType === 'PERCENTAGE' ? `(${appliedPromo.discountValue}%)` : ''}</p>
                                    <p className="discount-amount">-₹{appliedPromo.discountValue}</p>
                                </div>
                                <hr />
                            </>
                        )}
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>₹{total}</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>

                <div className="cart-promocode">
                    <div>
                        <p>Available Promo Codes</p>
                        <div className="available-promos">
                            {promoCodes.length > 0 ? (
                                promoCodes.map((promo) => (
                                    <div key={promo._id} className="promo-item">
                                        <p><strong>{promo.code}</strong> - {promo.description}</p>
                                        <p>Min Order: ₹{promo.minOrderAmount}</p>
                                        <p className="promo-discount">
                                            {promo.discountType === 'PERCENTAGE' 
                                                ? `${promo.discountValue}% OFF` 
                                                : `₹${promo.discountValue} OFF`}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-promos">No promo codes available</p>
                            )}
                        </div>
                        {appliedPromo ? (
                            <div className="applied-promo">
                                <div className="applied-promo-header">
                                    <p>Applied Promo Code</p>
                                    <button onClick={removePromoCode} className="remove-promo">
                                        Remove
                                    </button>
                                </div>
                                <div className="applied-promo-details">
                                    <p><strong>{appliedPromo.code}</strong></p>
                                    <p>{appliedPromo.description}</p>
                                    <p className="discount-info">
                                        {appliedPromo.discountType === 'PERCENTAGE' 
                                            ? `${appliedPromo.discountValue}% OFF` 
                                            : `₹${appliedPromo.discountValue} OFF`}
                                    </p>
                                    <p className="discount-amount">You save: ₹{discount}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p>Enter your promo code</p>
                                <div className="cart-promocode-input">
                                    <form onSubmit={handlePromoCodeSubmit}>
                                        <input 
                                            type="text" 
                                            placeholder="promo code" 
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            disabled={isPromoLoading}
                                        />
                                        <button type="submit" disabled={isPromoLoading}>
                                            {isPromoLoading ? 'Applying...' : 'Apply'}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                        {isPromoLoading && (
                            <div className="promo-loading">
                                <p>Applying promo code...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
