// import userModel from "../models/userModel.js"
// import mongoose from "mongoose"
// // const generateGuestId = () => `guest_${crypto.randomBytes(8).toString('hex')}`;

// // add products to user cart
// // addToCart function (Backend)
// const addToCart = async (req, res) => {
//     try {
//         const { itemId, size } = req.body;
//         let userId = req.body.userId;
//         console.log("Received userId: add to cart", userId);  // ✅ Debugging

//         let query = mongoose.Types.ObjectId.isValid(userId) ? { _id: userId } : { guestId: userId };

//         let user = await userModel.findOne(query);

//         if (!user) {
//             if (!userId.startsWith("guest_")) {
//                 return res.status(404).json({ message: "User not found" });
//             }
//             user = await userModel.create({ guestId: userId, name: `Guest_${userId}`, email:`${userId}@guestmail.com`, userType: "guest" });        }

//         let cartData = user.cartData || {};

//         if (!cartData[itemId]) {
//             cartData[itemId] = {};
//         }
//         cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

//         await userModel.findOneAndUpdate(query, { cartData });

//         res.status(200).json({ message: "Item added to cart!", guestId: userId });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // updateCart function (Backend)
// const updateCart = async (req, res) => {
//     try {
//         const { userId, itemId, size, quantity } = req.body;

//         let query = mongoose.Types.ObjectId.isValid(userId) ? { _id: userId } : { guestId: userId };

//         let user = await userModel.findOne(query);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         let cartData = user.cartData || {};
//         if (cartData[itemId] && cartData[itemId][size] !== undefined) {
//             cartData[itemId][size] = quantity;
//         }

//         await userModel.findOneAndUpdate(query, { cartData });

//         res.json({ success: true, message: "Cart Updated" });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // getUserCart function (Backend)
// const getUserCart = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         console.log("Received userId: get cart", userId);  // ✅ Debugging

//         if (!userId) return res.status(400).json({ message: "Missing userId" });

//         let query = mongoose.Types.ObjectId.isValid(userId)
//             ? { _id: userId }
//             : { guestId: userId };

//         let user = await userModel.findOne(query);
//         if (!user) return res.status(404).json({ message: "User not found using as guest" });
//         console.log("User cart:", user.cartData);  // ✅ Debugging
//         res.json({ success: true, cartData: user.cartData });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };



// export { addToCart, updateCart, getUserCart }
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

const addToCart = async (req, res) => {
  console.log("addToCart: Request body:", req.body);
  try {
    const { itemId, size } = req.body;
    const userId = req.userId; // From authUser middleware
    console.log("addToCart: User ID:", userId);

    if (!itemId || !size) {
      console.log("addToCart: Missing itemId or size");
      return res.status(400).json({ success: false, message: "Item ID and size are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("addToCart: Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    let user = await userModel.findOne({ _id: userId });
    console.log("addToCart: User found:", user ? user._id : "No user");

    if (!user) {
      console.log("addToCart: User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};
    console.log("addToCart: Current cart data:", cartData);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    console.log("addToCart: Updated cart data:", cartData);

    await userModel.findOneAndUpdate({ _id: userId }, { cartData });
    console.log("addToCart: Cart updated in DB for user:", userId);

    res.status(200).json({ success: true, message: "Item added to cart!", cartData });
  } catch (error) {
    console.error("addToCart: Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart
const updateCart = async (req, res) => {
  console.log("updateCart: Request body:", req.body);
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId; // From authUser middleware
    console.log("updateCart: User ID:", userId);

    if (!itemId || !size || quantity === undefined) {
      console.log("updateCart: Missing itemId, size, or quantity");
      return res.status(400).json({ success: false, message: "Item ID, size, and quantity are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("updateCart: Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    let user = await userModel.findOne({ _id: userId });
    console.log("updateCart: User found:", user ? user._id : "No user");

    if (!user) {
      console.log("updateCart: User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};
    console.log("updateCart: Current cart data:", cartData);

    if (quantity <= 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }
    console.log("updateCart: Updated cart data:", cartData);

    await userModel.findOneAndUpdate({ _id: userId }, { cartData });
    console.log("updateCart: Cart updated in DB for user:", userId);

    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.error("updateCart: Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  console.log("getUserCart: Request received");
  try {
    const userId = req.userId; // From authUser middleware
    console.log("getUserCart: User ID:", userId);

    if (!userId) {
      console.log("getUserCart: No userId provided");
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("getUserCart: Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    let user = await userModel.findOne({ _id: userId });
    console.log("getUserCart: User found:", user ? user._id : "No user");

    if (!user) {
      console.log("getUserCart: User not found for ID:", userId);
      return res.json({ success: false, message: "User not found" });
    }

    console.log("getUserCart: User cart data:", user.cartData);
    res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.error("getUserCart: Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
export { addToCart, updateCart, getUserCart };