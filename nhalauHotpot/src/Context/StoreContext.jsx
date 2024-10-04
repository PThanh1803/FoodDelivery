import { createContext, useEffect , useState} from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000"
    const [token, setToken] = useState("")
    const [cardItems, setCardItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const addToCard = async (itemId) => {
        if (!cardItems[itemId]) {
            setCardItems(prev => ({...prev, [itemId]: 1}))
        } else {
            setCardItems(prev => ({...prev, [itemId]: prev[itemId] + 1}))
        }

        if(token){
            await axios.post(`${url}/api/cart/add`, {itemId}, {headers: {token}})
        }
    }

    const removeFromCard = (itemId) => {
        setCardItems(prev => ({...prev, [itemId]: prev[itemId] - 1}))

        if(token){
            axios.post(`${url}/api/cart/remove`, {itemId}, {headers: {token}})
        }
    }

   
    const getTotalCartAmount = () => {
        let totalAmount = 0
        for(const item in cardItems) {
            if (cardItems[item] > 0) {
                let itemInfo = food_list.find((food) => food._id === item);
                totalAmount += itemInfo.price * cardItems[item]
            }                 
        }
        return totalAmount
    }

    const fetchFoodList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        setFoodList(response.data.data);
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, {
              headers: { token }
            });
            setCardItems(response.data.cartData);
            
          } catch (error) {
            console.error("Error loading cart data:", error);
          }
    }

    useEffect(() => {
        
        async function fetchData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
                console.log();
            }
        }
        fetchData();
    }, [])
    const contextValue = {
        food_list,
        cardItems,
        setCardItems,
        addToCard,
        removeFromCard,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

   
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider