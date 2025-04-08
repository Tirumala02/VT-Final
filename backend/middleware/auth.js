import jwt from 'jsonwebtoken';
// // const authUser = async (req, res, next) => {
// //     const { token, "temp-user": tempUser } = req.headers;
// //     console.log("Auth Middleware:", { token, tempUser });
// //     if (!token && !tempUser) {
// //         return res.json({ success: false, message: "Not Authorized. Login or continue as a guest." });
// //     }

// //     try {
// //         if (token) {
// //             const token_decode = jwt.verify(token, process.env.JWT_SECRET);
// //             req.body.userId = token_decode.id; // Logged-in user
// //         } else {
// //             req.body.userId = tempUser; // Guest user ID
// //         }
// //         next();
// //     } catch (error) {
// //         console.log(error);
// //         res.json({ success: false, message: error.message });
// //     }
// // };
// const authUser = (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split('Bearer ')[1];
//       if (!token && !req.headers['temp-user']) {
//         return res.status(401).json({ success: false, message: 'Unauthorized' });
//       }
  
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.id; // Attach userId to req for authenticated users
//       } else {
//         req.userId = req.headers['temp-user']; // Use tempUser for guests
//       }
//       next();
//     } catch (error) {
//       res.status(401).json({ success: false, message: 'Invalid token' });
//     }
//   };

const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;