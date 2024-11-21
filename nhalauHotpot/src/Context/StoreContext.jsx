import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);
import APIClient from "../client";
const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize from localStorage
    const [cardItems, setCardItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [userInfo, setUserInfo] = useState(
        JSON.parse(localStorage.getItem("user")) || {} // Initialize from localStorage
    );

    // Function to add item to cart
    const addToCard = async (itemId) => {
        setCardItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

        if (token) {
        
            const client = new APIClient('cart');
            const response = await client.create({ itemId });
            if (response.data.success) {
                console.log(response.data.message);
            }
            else {
                console.error(response.data.message);
            }
        }
    };

    // Function to remove item from cart
    const removeFromCard = async (itemId) => {
        setCardItems((prev) => {
            const updatedCardItems = { ...prev };
            if (updatedCardItems[itemId] > 1) {
                updatedCardItems[itemId] -= 1;
            } else {
                delete updatedCardItems[itemId];
            }
            return updatedCardItems;
        });

        if (token) {
            const client = new APIClient('cart');
            const response = await client.delete(itemId);
            if (response.data.success) {
                console.log(response.data.message);
            }
        }
    };

    // Function to calculate total cart amount
    const getTotalCartAmount = () => {
        return Object.keys(cardItems).reduce((total, itemId) => {
            const item = food_list.find((food) => food._id === itemId);
            return total + (item ? item.price * cardItems[itemId] : 0);
        }, 0);
    };

    // Fetch the list of foods
    const fetchFoodList = async () => {
        // try {
        //     const response = await axios.get(`${url}/api/food/`);
        //     setFoodList(response.data.data);
        // } catch (error) {
        //     console.error("Error fetching food list:", error);
        // }
        const client = new APIClient('food');
        const response = await client.find({});
        if (response.data.success) {
            setFoodList(response.data.data);
        }
    };

    // Log in the user and store token and user info
    const loginUser = async (email, password) => {
        const client = new APIClient('user/login')
        const response = await client.authenticate({ email, password, role: "user" });
        if (response.data.success) {
            setToken(response.data.token);
            setUserInfo(response.data.user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        return response.data;
    };

    // Load food list, token, and cart data on first mount
    useEffect(() => {
        fetchFoodList();

        if (token) {
            loadCartData(token);
        }
    }, [token]);

    // Load cart data if token is available
    const loadCartData = async (token) => {
        const client = new APIClient('cart');
        const response = await client.find({});
        if (response.data.success) {
            setCardItems(response.data.cartData);
        }
        else {
            console.error(response.data.message);
        }
    };

    // Save userInfo to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(userInfo));
    }, [userInfo]);

    // Save token to localStorage whenever it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }, [token]);

    const contextValue = {
        food_list,
        cardItems,
        setCardItems,
        addToCard,
        removeFromCard,
        getTotalCartAmount,
        url,
        token,
        setToken,
        userInfo,
        setUserInfo,
        loginUser,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
