import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart, isOrderEnabled, url } = useContext(StoreContext);

    return (
        <div className={`food-item ${!isOrderEnabled ? 'disabled' : ''}`}>
            <div className="food-item-img-container">
                <img 
                    className="food-item-image" 
                    src={`${url}/uploads/${image}`} 
                    alt={name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                />
                {!isOrderEnabled && (
                    <div className="disabled-overlay">
                        <span>Orders Disabled</span>
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">₹{price}</p>
            </div>
            <div className="food-item-counter">
                <img 
                    src={assets.remove_icon_red} 
                    onClick={() => removeFromCart(id)} 
                    alt="Remove"
                />
                <p>{cartItems[id]}</p>
                <img 
                    src={assets.add_icon_green} 
                    onClick={() => addToCart(id)} 
                    alt="Add"
                />
            </div>
        </div>
    )
}

export default FoodItem
