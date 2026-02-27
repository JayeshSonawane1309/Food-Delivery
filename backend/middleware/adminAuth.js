import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {
  const {token} = req.headers;
  if (!token) {
    return res.json({success: false, message: "Not Authorized Login Again"});
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(token_decode.id);

    if (!user) {
      return res.json({success: false, message: "User not found"});
    }

    if (user.role !== "admin") {
      return res.json({success: false, message: "Access Denied: Admin only"});
    }

    if (!req.body) {
      req.body = {};
    }
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    return res.json({success: false, message: "Error"});
  }
};

export default adminMiddleware;
