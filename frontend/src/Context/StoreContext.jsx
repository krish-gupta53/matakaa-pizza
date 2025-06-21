import React, { createContext, useEffect, useState } from "react";
import axios from "axios";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = `${import.meta.env.VITE_API_URL}`

    const [food_list, setFoodList] = useState([]);
    const [menu_list, setMenuList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [isOrderEnabled, setIsOrderEnabled] = useState(true);

    const addToCart = async (itemId) => {
        // Check order status before adding to cart
        await fetchOrderSettings();
        
        if (!isOrderEnabled) {
            alert("Orders are currently disabled");
            return;
        }
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const fetchMenuList = async () => {
        const response = await axios.get(url + "/api/menu/list");
        setMenuList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }

    const fetchOrderSettings = async () => {
        try {
            const response = await axios.get(`${url}/api/settings`);
            console.log('Settings response:', response.data);
            if (response.data.success) {
                const newOrderState = response.data.data.isOrderEnabled;
                console.log('New order state:', newOrderState);
                setIsOrderEnabled(newOrderState);
                if (!newOrderState) {
                    setCartItems({}); // Clear cart when orders are disabled
                }
            }
        } catch (error) {
            console.error('Error fetching order settings:', error);
        }
    };

    // Initial load of data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch food list
                const foodResponse = await axios.get(`${url}/api/food/list`);
                if (foodResponse.data.success) {
                    setFoodList(foodResponse.data.data);
                }

                // Fetch menu list
                const menuResponse = await axios.get(`${url}/api/menu/list`);
                if (menuResponse.data.success) {
                    setMenuList(menuResponse.data.data);
                }

                // Check for stored token and load cart
                const storedToken = localStorage.getItem("token");
                if (storedToken) {
                    setToken(storedToken);
                    await loadCartData({ token: storedToken });
                }

                // Check order settings on initial load
                await fetchOrderSettings();
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        isOrderEnabled,
        fetchOrderSettings
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
