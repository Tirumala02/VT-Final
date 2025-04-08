// import React from 'react'
// import { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import { useSearchParams } from 'react-router-dom'
// import { useEffect } from 'react'
// import {toast} from 'react-toastify'
// import axios from 'axios'

// const Verify = () => {

//     const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
//     const [searchParams, setSearchParams] = useSearchParams()
    
//     const success = searchParams.get('success')
//     const orderId = searchParams.get('orderId')

//     const verifyPayment = async () => {
//         try {

//             if (!token) {
//                 return null
//             }

//             const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: { token } })

//             if (response.data.success) {
//                 setCartItems({})
//                 navigate('/orders')
//             } else {
//                 navigate('/cart')
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }

//     useEffect(() => {
//         verifyPayment()
//     }, [token])

//     return (
//         <div>

//         </div>
//     )
// }

// export default Verify
import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl, tempUser } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  // Extract Razorpay-specific query parameters
  const success = searchParams.get('success'); // Custom param to indicate success/failure
  const razorpay_payment_id = searchParams.get('razorpay_payment_id');
  const razorpay_order_id = searchParams.get('razorpay_order_id');
  const razorpay_signature = searchParams.get('razorpay_signature');

  const verifyPayment = async () => {
    try {
      // Check if token or tempUser exists (for guest users)
      if (!token && !tempUser) {
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      // Prepare headers based on whether it's a logged-in user or guest
      const headers = token ? { headers: { token } } : { headers: { 'temp-user': tempUser } };

      // If success param is present and Razorpay params exist, verify Razorpay payment
      if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
        const response = await axios.post(
          `${backendUrl}/api/order/verifyRazorpay`,
          {
            userId: token ? undefined : tempUser, // Include userId only for guests
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          },
          headers
        );

        if (response.data.success) {
          setCartItems({}); // Clear cart only for non-Buy Now orders (assumed here)
          toast.success('Payment verified successfully!');
          navigate('/orders');
        } else {
          toast.error(response.data.message || 'Payment verification failed');
          navigate('/cart');
        }
      } else if (success && razorpay_order_id) {
        // Fallback for simpler verification if signature isn't provided
        const response = await axios.post(
          `${backendUrl}/api/order/verifyRazorpay`,
          { razorpay_order_id },
          headers
        );

        if (response.data.success) {
          setCartItems({});
          toast.success('Payment verified successfully!');
          navigate('/orders');
        } else {
          toast.error(response.data.message || 'Payment verification failed');
          navigate('/cart');
        }
      } else {
        toast.error('Invalid payment details');
        navigate('/cart');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during verification');
      navigate('/cart');
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token, tempUser]); // Trigger on token or tempUser change

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Verifying Your Payment...</h2>
        <p className="text-gray-600">Please wait while we process your transaction.</p>
      </div>
    </div>
  );
};

export default Verify;