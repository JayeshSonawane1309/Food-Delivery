import {createContext, useEffect, useState} from "react";
import axios from "axios";

// Create Context
export const StoreContext = createContext(null);

// Provider Component
const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

  const token = localStorage.getItem("token");

  const [signIn, setSignIn] = useState(false);

  const [userName, setUserName] = useState(null);

  const [food_list, setFoodList] = useState([]);

  const URL = import.meta.env.VITE_BACKEND_URL;

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${URL}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching food list");
    }
  };

  useEffect(() => {
    fetchFoodList();

    const token = localStorage.getItem("token");

    if (token) {
      loadCartData(token);
    }

    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser && parsedUser.name) {
          setSignIn(true);
          setUserName(parsedUser.name);
        } else {
          setSignIn(false);
          setUserName(null);
        }
      } catch (error) {
        setSignIn(false);
        setUserName(null);
      }
    } else {
      setSignIn(false);
      setUserName(null);
    }
  }, []);

  // Add to Cart
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => {
        return {...prev, [itemId]: 1};
      });
    } else {
      setCartItems((prev) => {
        return {...prev, [itemId]: prev[itemId] + 1};
      });
    }
    if (token) {
      await axios.post(URL + "/api/cart/add", {itemId}, {headers: {token}});
    }
  };

  // Remove from Cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      return {...prev, [itemId]: prev[itemId] - 1};
    });
    if (token) {
      await axios.post(URL + "/api/cart/remove", {itemId}, {headers: {token}});
    }
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      URL + "/api/cart/get",
      {},
      {headers: {token}},
    );
    setCartItems(response.data.cartData);
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => {
          return product._id === item;
        });
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  // Global Values
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    signIn,
    setSignIn,
    URL,
    userName,
    setUserName,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
