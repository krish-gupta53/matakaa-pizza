import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        phone: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, isOrderEnabled, fetchOrderSettings } = useContext(StoreContext);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        
        // Check order status before proceeding
        await fetchOrderSettings();
        console.log('Current order status:', isOrderEnabled);
        
        if (!isOrderEnabled) {
            toast.error("Orders are currently disabled");
            return;
        }

        if (getTotalCartAmount() === 0) {
            toast.error("Your cart is empty");
            navigate('/cart');
            return;
        }

        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        }))
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 5,
        }
        try {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            } else {
                toast.error(response.data.message || "Something Went Wrong")
            }
        } catch (error) {
            toast.error("Failed to place order. Please try again.");
            console.error('Error placing order:', error);
        }
    }

    useEffect(() => {
        const checkAccess = async () => {
            if (!token) {
                toast.error("Please sign in to place an order");
                navigate('/cart');
                return;
            }
            
            if (getTotalCartAmount() === 0) {
                toast.error("Your cart is empty");
                navigate('/cart');
                return;
            }

            await fetchOrderSettings();
            console.log('Order status after fetch:', isOrderEnabled);
            if (!isOrderEnabled) {
                toast.error("Orders are currently disabled");
                navigate('/cart');
                return;
            }
        };

        checkAccess();
    }, [token, getTotalCartAmount, isOrderEnabled, fetchOrderSettings]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="text" name='address' onChange={onChangeHandler} value={data.address} placeholder='Delivery Address' required />
                <input type="tel" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone Number' required />
                <button type="submit" disabled={!isOrderEnabled}>
                    {isOrderEnabled ? 'Proceed to Payment' : 'Orders Currently Disabled'}
                </button>
            </div>
        </form>
    )
}

export default PlaceOrder
