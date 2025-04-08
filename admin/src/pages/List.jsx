
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { IoIosClose } from "react-icons/io";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import Loading from '../components/Loading'; // Import your Loading component

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editOfferPrice, setEditOfferPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    finally{
      setIsLoading(false); 
    }
  };

  const removeProduct = async (id) => {
    const confirmDelete = window.localStorage.getItem('dontRemindDelete') === 'true';
    if (!confirmDelete) {
      const userConfirmed = window.confirm('Are you sure you want to delete this product?');
      if (!userConfirmed) return;

      const dontRemindAgain = window.confirm('Check OK if you don\'t want to be reminded again until closing the site.');
      if (dontRemindAgain) {
        window.localStorage.setItem('dontRemindDelete', 'true');
      }
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    finally{
      setIsLoading(false); 
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditPrice(product.price);
    setEditOfferPrice(product.offerPrice || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const savePrice = async () => {
    if (Number(editPrice) < 0 || (editOfferPrice && Number(editOfferPrice) < 0)) {
      toast.error('Prices cannot be negative');
      return;
    }
    if (isOfferPriceInvalid) {
      toast.error('Offer price cannot exceed original price');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update-price',
        {
          id: editingProduct._id,
          price: editPrice,
          offerPrice: editOfferPrice || null, // Send null if empty
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        closeModal();
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    finally{
      setIsLoading(false); 
    }
  };

  // Check if offer price exceeds original price
  const isOfferPriceInvalid = editOfferPrice && Number(editOfferPrice) > Number(editPrice);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
    <Loading isLoading={isLoading} />
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* ------- List Table Title ---------- */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Offer Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}
        {list.map((item, index) => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
            <img className='w-12' src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p>{item.offerPrice ? `${currency}${item.offerPrice}` : '-'}</p>
            <div className='flex gap-2 justify-center'>
              <button
                onClick={() => openEditModal(item)}
                className='text-sm bg-blue-500 text-white px-2 py-1 rounded'
              >
                <RiEdit2Fill className='text-2xl' alt='Edit item' />
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className='text-sm bg-red-500 text-white px-2 py-1 rounded'
              >
                <AiFillDelete className='text-2xl' alt='Delete item' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Price Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Prices</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <IoIosClose className='text-4xl' />
              </button>
            </div>

            <div className="mb-4">
              <img src={editingProduct.image[0]} alt={editingProduct.name} className="w-20 h-20 object-cover mx-auto mb-2" />
              <p className="text-center font-medium">{editingProduct.name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price ({currency})</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Offer Price ({currency})</label>
                <input
                  type="number"
                  value={editOfferPrice}
                  onChange={(e) => setEditOfferPrice(e.target.value)}
                  className={`w-full px-3 py-2 border rounded ${isOfferPriceInvalid ? 'border-red-500' : ''}`}
                  placeholder="Optional"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Red Starred Warning */}
              {isOfferPriceInvalid && (
                <p className="text-red-500 text-sm">
                  * Offer price cannot exceed original price
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={savePrice}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isOfferPriceInvalid}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;