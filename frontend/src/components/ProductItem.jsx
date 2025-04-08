// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import {Link} from 'react-router-dom'

// const ProductItem = ({id,image,name,price,offerPrice}) => {
    
//     const {currency} = useContext(ShopContext);

//   return (
//     <Link onClick={()=>scrollTo(0,0)} className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
//       <div className=' overflow-hidden'>
//         <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
//       </div>
//       <p className='pt-3 pb-1 text-sm'>{name}</p>
//       <p className=' text-sm font-medium'>{currency}{offerPrice}</p>
//       <p className=' text-xs font-medium line-through'>{currency}{price}</p>
//     </Link>
//   )
// }

// export default ProductItem
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, offerPrice }) => {
  const { currency } = useContext(ShopContext);

  // Calculate discount percentage if offerPrice exists and is less than price
  const discount = offerPrice && offerPrice < price 
    ? Math.round(((price - offerPrice) / price) * 100) 
    : 0;

  return (
    <Link 
      onClick={() => window.scrollTo(0, 0)} 
      to={`/product/${id}`}
      className='group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'
    >
      {/* Image Container */}
      <div className='relative overflow-hidden rounded-t-lg'>
        <img 
          className='w-full h-48 object-contain p-4 transform group-hover:scale-105 transition-transform duration-300' 
          src={image[0]} 
          alt={name}
        />
        {discount > 0 && (
          <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className='p-4'>
        {/* Product Name */}
        <p className='text-sm text-gray-900 font-medium line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors'>
          {name}
        </p>

        {/* Pricing */}
        <div className='mt-2 flex items-center gap-2'>
          <span className='text-lg font-bold text-black'>
            {currency}{offerPrice || price}
          </span>
          {offerPrice && offerPrice < price && (
            <span className='text-sm text-gray-500 line-through'>
              {currency}{price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;