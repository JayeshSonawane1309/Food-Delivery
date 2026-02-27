import express from "express";
import {
  loginUser,
  loginAdmin,
  logoutUser,
  registerUser,
  sendResetOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin-login", loginAdmin);
userRouter.post("/logout", logoutUser);
userRouter.post("/forgot-password", sendResetOtp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
