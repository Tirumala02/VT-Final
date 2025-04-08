import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Category = () => {
  const { categoryName } = useParams(); // Get the category name from URL
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Filter by search if active
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by the category from URL (assuming subCategory matches categoryName)
    if (categoryName) {
      productsCopy = productsCopy.filter(
        (item) => item.subCategory.toLowerCase() === categoryName.toLowerCase()
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [categoryName, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='flex flex-col pt-10 border-t'>
      {/* Right Side (No Filters, just Products) */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={categoryName.toUpperCase()} text2={'COLLECTION'} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border-2 border-gray-300 text-sm px-2'
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                offerPrice={item.offerPrice} // Include offerPrice if available
                image={item.image}
              />
            ))
          ) : (
            <p className='col-span-full text-center text-gray-500'>
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;