import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import Loading from '../components/Loading'; // Import your Loading component

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Shirts");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Show loading
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice || null);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setOfferPrice('');
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  // Check if offer price exceeds original price
  const isOfferPriceInvalid = offerPrice && Number(offerPrice) > Number(price);

  return (
    <div className="relative">
      <Loading isLoading={isLoading} />
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>
          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden disabled={isLoading} />
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden disabled={isLoading} />
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden disabled={isLoading} />
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden disabled={isLoading} />
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className='w-full max-w-[500px] px-3 py-2'
            type="text"
            placeholder='Type here'
            required
            disabled={isLoading}
          />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className='w-full max-w-[500px] px-3 py-2'
            placeholder='Write content here'
            required
            disabled={isLoading}
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>Product category</p>
            <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2' disabled={isLoading}>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Sub category</p>
            <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2' disabled={isLoading}>
              <option value="Shirts">Shirts</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Track Pants">Track Pants</option>
              <option value="Pants">Pants</option>
              <option value="Shorts">Shorts</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweatshirts">Sweatshirts</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className='w-full px-3 py-2 sm:w-[120px]'
              type="number"
              placeholder='25'
              min="0"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <p className='mb-2'>Offer Price</p>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              className='w-full px-3 py-2 sm:w-[120px]'
              type="number"
              placeholder='20'
              min="0"
              step="0.01"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>
            <div onClick={() => !isLoading && setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
              <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>S</p>
            </div>
            <div onClick={() => !isLoading && setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
              <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>M</p>
            </div>
            <div onClick={() => !isLoading && setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
              <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>L</p>
            </div>
            <div onClick={() => !isLoading && setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
              <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>XL</p>
            </div>
            <div onClick={() => !isLoading && setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
              <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>XXL</p>
            </div>
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input
            onChange={() => setBestseller(prev => !prev)}
            checked={bestseller}
            type="checkbox"
            id='bestseller'
            disabled={isLoading}
          />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        {/* Red Starred Warning */}
        {isOfferPriceInvalid && (
          <p className="text-red-500 text-sm mt-2">
            * Offer price cannot exceed original price
          </p>
        )}

        <button
          type="submit"
          className='w-28 py-3 mt-4 bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
          disabled={isOfferPriceInvalid || isLoading}
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;