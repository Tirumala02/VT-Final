import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    console.log("Token:", token);
    try {
      if (!token) {
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      console.log("Fetching orders with headers:", headers);

      // No userId in body since it’s derived from token in backend
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
        // Sort by date descending (newest first)
        allOrdersItem.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrderData(allOrdersItem);
      } else {
        console.warn("Order fetch failed:", response.data.message);
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("An error occurred while fetching orders");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Separate orders into "Ordered" and "Delivered"
  const orderedItems = orderData.filter((item) => item.status !== "Delivered");
  const deliveredItems = orderData.filter((item) => item.status === "Delivered");

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orderData.length > 0 ? (
        <div>
          {/* Ordered Section */}
          {orderedItems.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Orders</h3>
              {orderedItems.map((item, index) => (
                <div
                  key={index}
                  className="py-4 border-t border-b bg-gray-50 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-lg shadow-sm mb-4"
                >
                  <div className="flex items-start gap-6 text-sm">
                    <img className="w-16 sm:w-20 rounded" src={item.image[0]} alt={item.name} />
                    <div>
                      <p className="sm:text-base font-medium">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                        <p>
                          {currency}
                          {item.price}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                      <p className="mt-1">
                        Date: <span className="text-gray-500">{new Date(item.date).toLocaleString()}</span>
                      </p>
                      <p className="mt-1">
                        Payment: <span className="text-gray-500">{item.paymentMethod}</span>
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="min-w-2 h-2 rounded-full bg-yellow-500"></p>
                      <p className="text-sm md:text-base font-medium text-yellow-700">{item.status}</p>
                    </div>
                    <button
                      onClick={loadOrderData}
                      className="border px-4 py-2 text-sm font-medium rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Delivered Section */}
          {deliveredItems.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mt-12 mb-4">Delivered Orders</h3>
              {deliveredItems.map((item, index) => (
                <div
                  key={index}
                  className="py-4 border-t border-b bg-white text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-lg shadow-sm mb-4"
                >
                  <div className="flex items-start gap-6 text-sm">
                    <img className="w-16 sm:w-20 rounded" src={item.image[0]} alt={item.name} />
                    <div>
                      <p className="sm:text-base font-medium">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                        <p>
                          {currency}
                          {item.price}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                      <p className="mt-1">
                        Date: <span className="text-gray-500">{new Date(item.date).toLocaleString()}</span>
                      </p>
                      <p className="mt-1">
                        Payment: <span className="text-gray-500">{item.paymentMethod}</span>
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                      <p className="text-sm md:text-base font-medium text-green-700">{item.status}</p>
                    </div>
                    <button
                      onClick={loadOrderData}
                      className="border px-4 py-2 text-sm font-medium rounded-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Order Details
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-700 mb-4">You have no orders yet</p>
          <img src={assets.no_orders} alt="Empty Orders" className="w-32 mx-auto mb-6" />
          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white text-sm px-6 py-3 rounded"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;