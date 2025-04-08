import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Loading from '../components/Loading'; // Import the Loading component

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Wrap updateQuantity with loading state
  const handleUpdateQuantity = async (id, size, newQuantity) => {
    setIsLoading(true); // Show loading
    try {
      await updateQuantity(id, size, newQuantity); // Assume this is async
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  // Functions to handle quantity changes
  const increaseQuantity = (id, size, currentQuantity) => {
    handleUpdateQuantity(id, size, currentQuantity + 1);
  };

  const decreaseQuantity = (id, size, currentQuantity) => {
    if (currentQuantity > 1) {
      handleUpdateQuantity(id, size, currentQuantity - 1);
    }
  };

  return (
    <>
    {!token?(
      <div>
        {/* Login alert and navigate to login link */}
        <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
          <div className='bg-white w-full sm:w-1/2 h-1/2 flex flex-col items-center justify-center rounded-lg shadow-lg p-6'> 
            <p className="text-lg text-black mb-4">Please log in to view your cart.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-black text-white text-sm px-6 py-3"
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    )
    :
    (<div className="border-t pt-14 relative">
      {/* Loading Overlay */}
      <Loading isLoading={isLoading} />

      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length > 0 ? (
        <div>
          {cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={productData.image[0]} alt="" />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <div className="flex items-center gap-2">
                        <p
                          className={
                            productData.offerPrice && productData.offerPrice < productData.price
                              ? 'line-through text-gray-500'
                              : 'text-gray-700'
                          }
                        >
                          {currency}
                          {productData.price}
                        </p>
                        {productData.offerPrice && productData.offerPrice < productData.price && (
                          <p className="text-red-500 font-semibold">
                            {currency}
                            {productData.offerPrice}
                          </p>
                        )}
                      </div>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                    </div>
                  </div>
                </div>
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item._id, item.size, item.quantity)}
                    className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1 || isLoading} // Disable during loading
                  >
                    -
                  </button>
                  <span className="text-sm sm:text-base">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item._id, item.size, item.quantity)}
                    className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading} // Disable during loading
                  >
                    +
                  </button>
                </div>
                <img
                  onClick={() => handleUpdateQuantity(item._id, item.size, 0)}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            );
          })}

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={() => navigate('/place-order')}
                  className="bg-black text-white text-sm my-8 px-8 py-3"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-700 mb-4">Your cart is empty</p>
          <img
            src={assets.empty_cart}
            alt="Empty Cart"
            className="w-32 mx-auto mb-6"
          />
          <button
            onClick={() => navigate('/collection')}
            className="bg-black text-white text-sm px-6 py-3"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      )}
    </div>)}
    
    </>
  );
};

export default Cart;