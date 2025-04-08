// // // import React from 'react';
// // // import { Link } from 'react-router-dom';
// // // import Title from './Title';

// // // const categories = [
// // //   { name: "Shirts", image:"https://res.cloudinary.com/dx2dvybl9/image/upload/v1741501862/vmqshkcg7rw5dwdpkb7l.jpg" },
// // //   { name: "T Shirts", image: "https://assets.ajio.com/medias/sys_master/root/20230703/zEjF/64a2f7b8eebac147fc48ac61/-1117Wx1400H-466325670-purple-MODEL.jpg" },
// // //   { name: "Track Pants", image: "https://assets.ajio.com/medias/sys_master/root/20240710/Eai0/668e831c6f60443f31d682e1/-1117Wx1400H-441147738-jetblack-MODEL.jpg"},
// // // ];

// // // const ProductCategories = () => {
// // //   return (
// // //     <section className="py-12 bg-gray-100">
// // //       <div className="container mx-auto px-4 text-center">
// // //         <div className="py-8 text-3xl">
// // //           <Title text1={'SHOP BY'} text2={'CATEGORIES'} />
// // //           <p className="w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600">
// // //             Explore our diverse product categories and find everything you need.
// // //           </p>
// // //         </div>

// // //         <div className="flex flex-wrap justify-center gap-10">
// // //           {categories.map((category) => (
// // //             <Link
// // //               to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
// // //               key={category.name}
// // //               className="w-60 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
// // //             >
// // //               <div className="relative flex items-center justify-center w-full aspect-square bg-white">
// // //                 <img
// // //                   src={category.image}
// // //                   alt={category.name}
// // //                   className="max-h-full max-w-full object-contain"
// // //                 />
// // //               </div>
// // //               <div className="p-4">
// // //                 <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
// // //               </div>
// // //             </Link>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default ProductCategories;

// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import Title from './Title';

// // const categories = [
// //   { name: "Shirts", image: "https://res.cloudinary.com/dx2dvybl9/image/upload/v1741501862/vmqshkcg7rw5dwdpkb7l.jpg" },
// //   { name: "T Shirts", image: "https://assets.ajio.com/medias/sys_master/root/20230703/zEjF/64a2f7b8eebac147fc48ac61/-1117Wx1400H-466325670-purple-MODEL.jpg" },
// //   { name: "Track Pants", image: "https://assets.ajio.com/medias/sys_master/root/20240710/Eai0/668e831c6f60443f31d682e1/-1117Wx1400H-441147738-jetblack-MODEL.jpg" },
// // ];

// // const ProductCategories = () => {
// //   return (
// //     <section className="py-12 bg-gray-100">
// //       <div className="container mx-auto px-4 text-center">
// //         <div className="py-8 text-3xl">
// //           <Title text1={'SHOP BY'} text2={'CATEGORIES'} />
// //           <p className="w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600">
// //             Explore our diverse product categories and find everything you need.
// //           </p>
// //         </div>

// //         <div className="flex flex-wrap justify-center gap-10">
// //           {categories.map((category) => (
// //             <Link
// //               to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
// //               key={category.name}
// //               className="w-60 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
// //             >
// //               <div className="relative flex items-center justify-center w-full aspect-square bg-white">
// //                 <img
// //                   src={category.image}
// //                   alt={category.name}
// //                   className="max-h-full max-w-full object-contain"
// //                 />
// //               </div>
// //               <div className="p-4">
// //                 <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default ProductCategories;
// import React, { useRef, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Title from './Title';
// import { assets } from '../assets/assets'; // Assuming you have arrow icons in your assets

// const categories = [
//   { name: "Shirts", image: "https://res.cloudinary.com/dx2dvybl9/image/upload/v1741501862/vmqshkcg7rw5dwdpkb7l.jpg" },
//   { name: "T Shirts", image: "https://assets.ajio.com/medias/sys_master/root/20230703/zEjF/64a2f7b8eebac147fc48ac61/-1117Wx1400H-466325670-purple-MODEL.jpg" },
//   { name: "Track Pants", image: "https://assets.ajio.com/medias/sys_master/root/20220125/NdPb/61ef13c0aeb2695cdd2bb6b8/-473Wx593H-441128505-jetblack-MODEL.jpg" },
//   { name: "Pants", image: "https://assets.ajio.com/medias/sys_master/root/20241112/LIuo/67338e16260f9c41e8d55613/-1117Wx1400H-700729505-grey-MODEL.jpg" },
//   { name: "Shorts", image: "https://assets.ajio.com/medias/sys_master/root/20240214/hJUo/65ccdb3605ac7d77bb578c47/-473Wx593H-469599666-navy-MODEL.jpg" },
//   { name: "Jackets", image: "https://assets.ajio.com/medias/sys_master/root/20231225/MKbb/6588d899ddf7791519e4e885/-473Wx593H-466904610-grey-MODEL.jpg" },
//   { name: "Sweatshirts", image: "https://assets.ajio.com/medias/sys_master/root/20241011/4S1Z/67087f19f9b8ef490badf25d/-473Wx593H-700566153-black-MODEL.jpg" },
// ];

// const ProductCategories = () => {
//   const scrollRef = useRef(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);

//   // Check scroll position to show/hide arrows
//   const checkScroll = () => {
//     const scrollElement = scrollRef.current;
//     if (scrollElement) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
//       setShowLeftArrow(scrollLeft > 0);
//       setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
//     }
//   };

//   // Handle scroll on mount and on scroll event
//   useEffect(() => {
//     checkScroll();
//     const scrollElement = scrollRef.current;
//     if (scrollElement) {
//       scrollElement.addEventListener('scroll', checkScroll);
//       return () => scrollElement.removeEventListener('scroll', checkScroll);
//     }
//   }, []);

//   // Scroll left or right by a fixed amount
//   const scroll = (direction) => {
//     const scrollElement = scrollRef.current;
//     if (scrollElement) {
//       const scrollAmount = 300; // Adjust as needed
//       scrollElement.scrollBy({
//         left: direction === 'left' ? -scrollAmount : scrollAmount,
//         behavior: 'smooth',
//       });
//     }
//   };

//   return (
//     <section className="py-12 bg-gray-100">
//       <div className="container mx-auto px-4 text-center">
//         <div className="py-8 text-3xl">
//           <Title text1={'SHOP BY'} text2={'CATEGORIES'} />
//           <p className="w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600">
//             Explore our diverse product categories and find everything you need.
//           </p>
//         </div>

//         <div className="relative">
//           {/* Left Arrow */}
//           {showLeftArrow && (
//             <button
//               onClick={() => scroll('left')}
//               className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-200"
//             >
//               <img src={assets.left_arrow} alt="Scroll Left" className="w-6 h-6" /> {/* Add left arrow icon to assets */}
//             </button>
//           )}

//           {/* Scrollable Category Container */}
//           <div
//             ref={scrollRef}
//             className="flex overflow-x-auto scroll-smooth gap-6 pb-4 snap-x snap-mandatory"
//             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar
//           >
//             {categories.map((category) => (
//               <Link
//                 to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
//                 key={category.name}
//                 className="flex-shrink-0 w-60 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 snap-center"
//               >
//                 <div className="relative flex items-center justify-center w-full aspect-square bg-white">
//                   <img
//                     src={category.image}
//                     alt={category.name}
//                     className="max-h-full max-w-full object-contain"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
//                 </div>
//               </Link>
//             ))}
//           </div>

//           {/* Right Arrow */}
//           {showRightArrow && (
//             <button
//               onClick={() => scroll('right')}
//               className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-200"
//             >
//               <img src={assets.right_arrow} alt="Scroll Right" className="w-6 h-6" /> {/* Add right arrow icon to assets */}
//             </button>
//           )}
//         </div>

//         {/* CSS to hide scrollbar */}
//         <style>
//           {`
//             .scroll-smooth::-webkit-scrollbar {
//               display: none;
//             }
//           `}
//         </style>
//       </div>
//     </section>
//   );
// };

// export default ProductCategories;
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from './Title';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'; // Import chevron icons

const categories = [
  { name: "Shirts", image: "https://res.cloudinary.com/dx2dvybl9/image/upload/v1741501862/vmqshkcg7rw5dwdpkb7l.jpg" },
  { name: "T Shirts", image: "https://assets.ajio.com/medias/sys_master/root/20230703/zEjF/64a2f7b8eebac147fc48ac61/-1117Wx1400H-466325670-purple-MODEL.jpg" },
  { name: "Track Pants", image: "https://assets.ajio.com/medias/sys_master/root/20220125/NdPb/61ef13c0aeb2695cdd2bb6b8/-473Wx593H-441128505-jetblack-MODEL.jpg" },
  { name: "Pants", image: "https://assets.ajio.com/medias/sys_master/root/20241112/LIuo/67338e16260f9c41e8d55613/-1117Wx1400H-700729505-grey-MODEL.jpg" },
  { name: "Shorts", image: "https://assets.ajio.com/medias/sys_master/root/20240214/hJUo/65ccdb3605ac7d77bb578c47/-473Wx593H-469599666-navy-MODEL.jpg" },
  { name: "Jackets", image: "https://assets.ajio.com/medias/sys_master/root/20231225/MKbb/6588d899ddf7791519e4e885/-473Wx593H-466904610-grey-MODEL.jpg" },
  { name: "Sweatshirts", image: "https://assets.ajio.com/medias/sys_master/root/20241011/4S1Z/67087f19f9b8ef490badf25d/-473Wx593H-700566153-black-MODEL.jpg" },
];

const ProductCategories = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    }
  };

  // Handle scroll on mount and on scroll event
  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, []);

  // Scroll left or right by a fixed amount
  const scroll = (direction) => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const scrollAmount = 300; // Adjust as needed
      scrollElement.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <div className="py-8 text-3xl">
          <Title text1={'SHOP BY'} text2={'CATEGORIES'} />
          <p className="w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600">
            Explore our diverse product categories and find everything you need.
          </p>
        </div>

        <div className="relative">
          {/* Left Chevron (Rotated 90° counterclockwise) */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-200"
            >
              <MdChevronLeft
                className="w-6 h-6 text-gray-800 rotate-0" // Rotate 90° counterclockwise
              />
            </button>
          )}

          {/* Scrollable Category Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth gap-6 pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={category.name}
                className="flex-shrink-0 w-60 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 snap-center"
              >
                <div className="relative flex items-center justify-center w-full aspect-square bg-white">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Chevron (Rotated 90° clockwise) */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-200"
            >
              <MdChevronRight
                className="w-6 h-6 text-gray-800 "
              />
            </button>
          )}
        </div>

        {/* CSS to hide scrollbar */}
        <style>
          {`
            .scroll-smooth::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </div>
    </section>
  );
};

export default ProductCategories;