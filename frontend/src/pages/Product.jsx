
// import React, { useContext, useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// import { assets } from '../assets/assets';
// import RelatedProducts from '../components/RelatedProducts';
// import Loading from '../components/Loading';
// import Cookies from 'js-cookie';

// const Product = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const { products, currency, cartItems, addToCart, updateQuantity } = useContext(ShopContext);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState('');
//   const [size, setSize] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showGuestWarning, setShowGuestWarning] = useState(false);

//   const fetchProductData = async () => {
//     products.map((item) => {
//       if (item._id === productId) {
//         setProductData(item);
//         setImage(item.image[0]);
//         return null;
//       }
//     });
//   };

//   useEffect(() => {
//     fetchProductData();
//   }, [productId, products]);

//   const isInCart = size && cartItems[productId]?.[size] > 0;
//   const currentQuantity = isInCart ? cartItems[productId][size] : 0;

//   const checkGuestMode = (callback) => {
//     const isLoggedIn = false; // Replace with your actual auth check
//     const hasSeenWarning = Cookies.get('guestWarningSeen');

//     if (!isLoggedIn && !hasSeenWarning) {
//       setShowGuestWarning(true);
//       return;
//     }
//     callback();
//   };

//   const handleAddToCart = async () => {
//     if (!size) {
//       alert('Please select a size');
//       return;
//     }
//     checkGuestMode(async () => {
//       setIsLoading(true);
//       try {
//         await addToCart(productData._id, size, 1);
//         Cookies.set('guestWarningSeen', 'true', { expires: 30 });
//       } catch (error) {
//         console.error('Error adding to cart:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     });
//   };

//   const increaseQuantity = async () => {
//     setIsLoading(true);
//     try {
//       await updateQuantity(productData._id, size, currentQuantity + 1);
//     } catch (error) {
//       console.error('Error increasing quantity:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const decreaseQuantity = async () => {
//     if (currentQuantity > 1) {
//       setIsLoading(true);
//       try {
//         await updateQuantity(productData._id, size, currentQuantity - 1);
//       } catch (error) {
//         console.error('Error decreasing quantity:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleBuyNow = () => {
//     if (!size) {
//       alert('Please select a size');
//       return;
//     }
//     checkGuestMode(() => {
//       Cookies.set('guestWarningSeen', 'true', { expires: 30 });
//       navigate('/place-order', {
//         state: { buyNowItem: { _id: productData._id, size, quantity: 1 } },
//       });
//     });
//   };

//   const handleWarningClose = () => {
//     setShowGuestWarning(false);
//     Cookies.set('guestWarningSeen', 'true', { expires: 30 });
//   };

//   const handleLoginRedirect = () => {
//     setShowGuestWarning(false);
//     Cookies.set('guestWarningSeen', 'true', { expires: 30 });
//     navigate('/login');
//   };

//   return productData ? (
//     <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 relative">
//       <Loading isLoading={isLoading} />
      
//       {/* Guest Warning Popup */}
//       {showGuestWarning && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-md animate-fadeIn">
//             <h3 className="text-lg font-semibold mb-4">Guest Mode Warning</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               You are using the site as a guest. All cart and purchased items will be placed as a guest and will be visible for 30 days <span className='font-bold'>until you clear your browser cookies or log in after purchasing.</span> If you purchase items in guest mode,<span className='font-bold'> please do not login/sign up until your orders are delivered.</span>
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={handleWarningClose}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Continue as Guest
//               </button>
//               <button
//                 onClick={handleLoginRedirect}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Take me to login page
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
//         <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
//             {productData.image.map((item, index) => (
//               <img
//                 onClick={() => setImage(item)}
//                 src={item}
//                 key={index}
//                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
//                 alt=""
//               />
//             ))}
//           </div>
//           <div className="w-full sm:w-[80%]">
//             <img className="w-full h-auto" src={image} alt="" />
//           </div>
//         </div>

//         <div className="flex-1">
//           <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
//           <div className="flex items-center gap-1 mt-2">
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_dull_icon} alt="" className="w-3.5" />
//             <p className="pl-2">(122)</p>
//           </div>

//           <div className="mt-5 flex items-center gap-3">
//             <p className="text-3xl font-semibold text-black">
//               {currency}
//               {productData.offerPrice || productData.price}
//             </p>
//             {productData.offerPrice && productData.offerPrice < productData.price && (
//               <p className="text-xl text-gray-500 line-through">
//                 {currency}
//                 {productData.price}
//               </p>
//             )}
//             {productData.offerPrice && productData.offerPrice < productData.price && (
//               <span className="text-sm text-green-600 font-medium">
//                 {Math.round(
//                   ((productData.price - productData.offerPrice) / productData.price) * 100
//                 )}
//                 % OFF
//               </span>
//             )}
//           </div>

//           <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
//           <div className="flex flex-col gap-4 my-8">
//             <p>Select Size</p>
//             <div className="flex gap-2">
//               {productData.sizes.map((item, index) => (
//                 <button
//                   onClick={() => setSize(item)}
//                   className={`border py-2 px-4 bg-gray-100 ${
//                     item === size ? 'border-orange-500' : ''
//                   }`}
//                   key={index}
//                   disabled={isLoading}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex gap-4 mb-8">
//             {isInCart ? (
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={decreaseQuantity}
//                   className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={currentQuantity <= 1 || isLoading}
//                 >
//                   -
//                 </button>
//                 <span className="text-base">{currentQuantity}</span>
//                 <button
//                   onClick={increaseQuantity}
//                   className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={isLoading}
//                 >
//                   +
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={handleAddToCart}
//                 className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isLoading}
//               >
//                 ADD TO CART
//               </button>
//             )}
//             <button
//               onClick={handleBuyNow}
//               className="bg-orange-500 text-white px-8 py-3 text-sm active:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={isLoading}
//             >
//               BUY NOW
//             </button>
//           </div>

//           <hr className="mt-8 sm:w-4/5" />
//           <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//             <p>100% Original product.</p>
//             <p>Cash on delivery is available on this product.</p>
//             <p>Easy return and exchange policy within 7 days.</p>
//           </div>
//         </div>
//       </div>

//       <div className="mt-20">
//         <div className="flex">
//           <b className="border px-5 py-3 text-sm">Description</b>
//           <p className="border px-5 py-3 text-sm">Reviews (122)</p>
//         </div>
//         <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
//           <p>
//             An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet...
//           </p>
//           <p>
//             E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations...
//           </p>
//         </div>
//       </div>

//       <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
//     </div>
//   ) : (
//     <div className="opacity-0"></div>
//   );
// };

// export default Product;

// // Add this to your CSS file (e.g., styles.css or Product.css)
// const styles = `
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(-20px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
  
//   .animate-fadeIn {
//     animation: fadeIn 0.3s ease-out;
//   }
// `;
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import Loading from "../components/Loading";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, cartItems, addToCart, buyNow, updateQuantity } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const isInCart = size && cartItems[productId]?.[size] > 0;
  const currentQuantity = isInCart ? cartItems[productId][size] : 0;

  const handleAddToCart = async () => {
    if (!size) {
      alert("Please select a size");
      return;
    }
    setIsLoading(true);
    try {
      await addToCart(productData._id, size);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!size) {
      alert("Please select a size");
      return;
    }
    setIsLoading(true);
    try {
      await buyNow(productData._id, size);
    } catch (error) {
      console.error("Error in buy now:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantity = async () => {
    setIsLoading(true);
    try {
      await updateQuantity(productData._id, size, currentQuantity + 1);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseQuantity = async () => {
    if (currentQuantity > 1) {
      setIsLoading(true);
      try {
        await updateQuantity(productData._id, size, currentQuantity - 1);
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 relative">
      <Loading isLoading={isLoading} />

      <div className="flex flex-col gap-12 sm:flex-row sm:gap-12">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2 text-sm text-gray-600">(122)</p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <p className="text-3xl font-semibold text-black">
              {currency}
              {productData.offerPrice || productData.price}
            </p>
            {productData.offerPrice && productData.offerPrice < productData.price && (
              <p className="text-xl text-gray-500 line-through">
                {currency}
                {productData.price}
              </p>
            )}
            {productData.offerPrice && productData.offerPrice < productData.price && (
              <span className="text-sm text-green-600 font-medium">
                {Math.round(
                  ((productData.price - productData.offerPrice) / productData.price) * 100
                )}
                % OFF
              </span>
            )}
          </div>

          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p className="text-gray-700">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 hover:bg-gray-200 ${
                    item === size ? "border-orange-500" : "border-gray-300"
                  } disabled:opacity-50`}
                  key={index}
                  disabled={isLoading}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            {isInCart ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentQuantity <= 1 || isLoading}
                >
                  -
                </button>
                <span className="text-base">{currentQuantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                ADD TO CART
              </button>
            )}
            <button
              onClick={handleBuyNow}
              className="bg-orange-500 text-white px-8 py-3 text-sm hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              BUY NOW
            </button>
          </div>

          <hr className="mt-8 sm:w-4/5 border-gray-300" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex">
          <b className="border border-gray-300 px-5 py-3 text-sm">Description</b>
          <p className="border border-gray-300 px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border border-gray-300 px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet...
          </p>
          <p>
            E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations...
          </p>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;