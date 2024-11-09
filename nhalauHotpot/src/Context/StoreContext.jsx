import { createContext, useEffect, useState } from "react";
import axios from "axios";



export const StoreContext = createContext(null)


const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [cardItems, setCardItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        avatar: '',
        wishlist: []
    });
    const addToCard = async (itemId) => {
        if (!cardItems[itemId]) {
            setCardItems(prev => ({ ...prev, [itemId]: 1 }));
        } else {
            setCardItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }

        if (token) {
            const response = await axios.post(`${url}/api/cart/`, { itemId }, { headers: { token } });

            if (response.data.success) {
                console.log(response.data.message);
            }

        }
    };

    const removeFromCard = async (itemId) => {
        setCardItems(prev => {
            const updatedCardItems = { ...prev };
            if (updatedCardItems[itemId] > 1) {
                updatedCardItems[itemId] -= 1;
            } else {
                delete updatedCardItems[itemId]; // Xóa item nếu số lượng bằng 0
            }
            return updatedCardItems;
        });

        if (token) {
            await axios.delete(`${url}/api/cart/${itemId}`, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        return Object.keys(cardItems).reduce((totalAmount, item) => {
            if (cardItems[item] > 0) {
                const itemInfo = food_list.find(food => food._id === item);
                return totalAmount + (itemInfo.price * cardItems[item]);
            }
            return totalAmount;
        }, 0);
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };


    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${url}/api/user/login`, { email, password });
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setUserInfo(response.data.user);
                console.log(response.data.user);
                // Lưu thông tin người dùng
            }
            return response.data;

        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Login failed" };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                setUserInfo(JSON.parse(localStorage.getItem("user")));
                console.log(userInfo);
                await loadCartData(storedToken); // truyền token vào loadCartData
            }
        };
        fetchData();
    }, []);

    const loadCartData = async (token) => { // thêm token vào tham số
        if (token) {
            console.log("Token found:", token);
            try {
                const response = await axios.get(`${url}/api/cart/`, { headers: { token } });
                if (response.data.success) {
                    setCardItems(response.data.cartData);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error("Error loading cart data:", error);
            }
        } else {
            console.log("No token");
        }
    };


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
        userInfo, // Thêm thông tin người dùng vào context
        setUserInfo, // Hàm để cập nhật thông tin người dùng
        loginUser,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
