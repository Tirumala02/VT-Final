
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 100;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false); // New state for popup

  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!token) {
      setShowLoginPopup(true); // Show popup instead of toast
      return;
    }

    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const cartData = structuredClone(cartItems);
        cartData[itemId] = cartData[itemId] || {};
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        setCartItems(cartData); // Only update state on success
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const buyNow = async (itemId, size) => {
    if (!token) {
      setShowLoginPopup(true); // Show popup instead of toast
      return;
    }

    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    try {
      await addToCart(itemId, size); // Add to cart first
      navigate("/place-order", {
        state: { buyNowItem: { _id: itemId, size, quantity: 1 } },
      });
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error(error.response?.data?.message || "Failed to proceed");
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (!token) {
      toast.error("You need to log in to update your cart.", {
        onClose: () => navigate("/login"),
      });
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const cartData = structuredClone(cartItems);
        if (quantity <= 0) {
          delete cartData[itemId][size];
          if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
        } else {
          cartData[itemId][size] = quantity;
        }
        setCartItems(cartData); // Only update state on success
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalAmount +=
            (itemInfo?.offerPrice || itemInfo?.price || 0) * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Get products error:", error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        console.warn("Cart fetch failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error(error.response?.data?.message || "Failed to fetch cart");
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart();
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    buyNow,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  // return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
  // return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
  return (
    <ShopContext.Provider value={value}>
      {props.children}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              You Aren’t Logged In
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Log in to add products to your cart or proceed with your purchase.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate("/login");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;