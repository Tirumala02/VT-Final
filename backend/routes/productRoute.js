import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct, updatePrice } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import productModel from "../models/productModel.js";

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
// productRouter.post('/update-price', adminAuth,updatePrice)
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts)
productRouter.post('/update-price', async (req, res) => {
    try {
      const { id, price, offerPrice } = req.body
      
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        { $set: { price, offerPrice } },
        { new: true }
      )
      
      if (!updatedProduct) {
        return res.status(404).send({ success: false, message: "Product not found" })
      }
      
      res.status(200).send({ success: true, message: "Prices updated successfully", product: updatedProduct })
    } catch (error) {
      res.status(500).send({ success: false, message: "Error updating prices", error: error.message })
    }
  })
export default productRouter