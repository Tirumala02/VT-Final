import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import CartTotal from "../components/CartTotal";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const [countdown, setCountdown] = useState(3);

  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = !!buyNowItem;
  const buyNowProduct = buyNowItem
    ? products.find((p) => p._id === buyNowItem._id)
    : null;
  const [buyNowQuantity, setBuyNowQuantity] = useState(buyNowItem?.quantity || 1);

  useEffect(() => {
    if (!token) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-600">
            Redirecting to login in {countdown} second{countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    );
  }

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const increaseQuantity = () => setBuyNowQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (buyNowQuantity > 1) setBuyNowQuantity((prev) => prev - 1);
  };

  const initPay = (orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount * 100,
      currency: "INR",
      name: "VT Fashions",
      description: "Order Payment",
      order_id: orderData.orderId,
      receipt: orderData.receipt,
      handler: async (response) => {
        try {
          console.log("initPay: Razorpay response:", response);
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            headers
          );
          if (data.success) {
            navigate("/orders");
            if (!isBuyNow) setCartItems({});
            // Add paymentId to orderData
            const updatedOrderData = {
              ...orderData,
              paymentId: response.razorpay_payment_id,
            };
            await sendOrderConfirmationEmail(updatedOrderData);
            toast.success("Payment successful!");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Razorpay verification error:", error);
          toast.error(
            error.response?.data?.message || "Payment verification failed"
          );
        } finally {
          setIsLoading(false);
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#000000",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      toast.error(`Payment failed: ${response.error.description}`);
      setIsLoading(false);
    });
    rzp.open();
  };

  const sendOrderConfirmationEmail = async (orderData) => {
    try {
      console.log("sendOrderConfirmationEmail: Sending email with token:", token);
      console.log("sendOrderConfirmationEmail: Order data:", orderData);
      console.log("sendOrderConfirmationEmail: Headers:", headers);

      const response = await axios.post(
        `${backendUrl}/api/order/send-email`,
        { orderData },
        headers
      );
      console.log("sendOrderConfirmationEmail: Response:", response.data);
      toast.success("Order confirmation email sent!");
    } catch (error) {
      console.error("sendOrderConfirmationEmail: Error:", error.response?.status, error.response?.data);
      toast.error("Failed to send confirmation email.");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      let orderItems = [];

      if (isBuyNow) {
        const itemInfo = structuredClone(
          products.find((product) => product._id === buyNowItem._id)
        );
        if (itemInfo) {
          itemInfo.size = buyNowItem.size;
          itemInfo.quantity = buyNowQuantity;
          orderItems.push(itemInfo);
        }
      } else {
        for (const items in cartItems) {
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              const itemInfo = structuredClone(
                products.find((product) => product._id === items)
              );
              if (itemInfo) {
                itemInfo.size = item;
                itemInfo.quantity = cartItems[items][item];
                orderItems.push(itemInfo);
              }
            }
          }
        }
      }

      const orderAmount = isBuyNow
        ? (buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity + delivery_fee
        : getCartAmount() + delivery_fee;

        const getFormattedDate = (date) => {
          const day = date.getDate();
          const suffix = ['th', 'st', 'nd', 'rd'][((day % 100 - 20) % 10)] || 'th';
          const options = { month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
          return `${day}${suffix} ${date.toLocaleString('en-US', options)}`;
        };
        
      const orderDate = getFormattedDate(new Date())

      let orderData = {
        address: formData,
        items: orderItems,
        amount: orderAmount,
        email: formData.email,
        paymentMethod: method,
        currency: "INR",
        date: orderDate,
      };

      console.log("onSubmitHandler: Prepared orderData:", orderData);

      switch (method) {
        case "cod":
          console.log("onSubmitHandler: Placing COD order with orderData:", orderData);
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            headers
          );
          console.log("onSubmitHandler: COD response:", response.data);
          if (response.data.success) {
            if (!isBuyNow) setCartItems({});
            navigate("/orders");
            await sendOrderConfirmationEmail(orderData);
          } else {
            toast.error(response.data.message);
          }
          setIsLoading(false);
          break;

        case "razorpay":
          console.log("onSubmitHandler: Initiating Razorpay order with orderData:", orderData);
          const responseRazorpay = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            headers
          );
          console.log("onSubmitHandler: Razorpay response:", responseRazorpay.data);
          if (responseRazorpay.data.success) {
            const razorpayOrderData = {
              ...orderData,
              orderId: responseRazorpay.data.order.id,
              receipt: responseRazorpay.data.order.receipt,
            };
            initPay(razorpayOrderData);
          } else {
            toast.error(responseRazorpay.data.message);
            setIsLoading(false);
          }
          break;

        default:
          setIsLoading(false);
          break;
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while placing the order"
      );
      setIsLoading(false);
    }
  };

  const itemTotal = buyNowProduct
    ? (buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity
    : 0;
  const orderTotal = itemTotal + delivery_fee;

  return (
    <form
      onSubmit={onSubmitHandler}
      className="pt-5 sm:pt-14 min-h-[80vh] border-t relative"
    >
      <Loading isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isBuyNow && buyNowProduct && (
          <div className="border p-6 rounded-lg shadow-md bg-white text-center">
            <h2 className="text-xl font-semibold mb-4">Product</h2>
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 mx-auto">
              <img
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg"
                src={buyNowProduct.image[0]}
                alt={buyNowProduct.name}
              />
              <div className="flex-1">
                <p className="font-medium text-lg">{buyNowProduct.name}</p>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {buyNowProduct.description}...
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex md:flex-row flex-col items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Size: {buyNowItem.size}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={decreaseQuantity}
                        className="w-6 h-6 flex items-center justify-center bg-blue-300 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        disabled={buyNowQuantity <= 1 || isLoading}
                        type="button"
                      >
                        -
                      </button>
                      <span className="text-base font-semibold w-8 text-center">
                        {buyNowQuantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        className="w-6 h-6 flex items-center justify-center bg-blue-300 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        disabled={isLoading}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900 ml-4 m-4">
                  ₹{(buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Delivery Information</h2>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                required
                onChange={onChangeHandler}
                name="firstName"
                value={formData.firstName}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
                type="text"
                placeholder="First name"
                disabled={isLoading}
              />
              <input
                required
                onChange={onChangeHandler}
                name="lastName"
                value={formData.lastName}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
                type="text"
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>
            <input
              required
              onChange={onChangeHandler}
              name="email"
              value={formData.email}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
              type="email"
              placeholder="Email address"
              disabled={isLoading}
            />
            <input
              required
              onChange={onChangeHandler}
              name="street"
              value={formData.street}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
              type="text"
              placeholder="Street"
              disabled={isLoading}
            />
            <div className="flex gap-3">
              <input
                required
                onChange={onChangeHandler}
                name="city"
                value={formData.city}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
                type="text"
                placeholder="City"
                disabled={isLoading}
              />
              <input
                onChange={onChangeHandler}
                name="state"
                value={formData.state}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
                type="text"
                placeholder="State"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-3">
              <input
                required
                onChange={onChangeHandler}
                name="zipcode"
                value={formData.zipcode}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
                type="number"
                placeholder="Zipcode"
                disabled={isLoading}
              />
              <input
                required
                onChange={onChangeHandler}
                name="country"
                value={formData.country}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
                type="text"
                placeholder="Country"
                disabled={isLoading}
              />
            </div>
            <input
              required
              onChange={onChangeHandler}
              name="phone"
              value={formData.phone}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full disabled:opacity-50"
              type="number"
              placeholder="Phone"
              disabled={isLoading}
            />
          </div>
        </div>

        {isBuyNow && buyNowProduct && (
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Payment Method</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={method === "razorpay"}
                  onChange={() => setMethod("razorpay")}
                  disabled={isLoading}
                />
                <img className="h-5" src={assets.razorpay_logo} alt="Razorpay" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                  disabled={isLoading}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
            {isBuyNow && (
              <div className="mt-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>₹{itemTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹{delivery_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Order Total:</span>
                  <span>₹{orderTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 text-sm mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              PLACE ORDER
            </button>
          </div>
        )}
      </div>

      {!isBuyNow && (
        <div className="mt-8">
          <CartTotal />
          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            <div className="flex gap-3 flex-col lg:flex-row">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={method === "razorpay"}
                  onChange={() => setMethod("razorpay")}
                  disabled={isLoading}
                />
                <img className="h-5" src={assets.razorpay_logo} alt="Razorpay" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                  disabled={isLoading}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default PlaceOrder;