import userModel from "../models/userModel.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import sgMail from "@sendgrid/mail";

// Configure SendGrid with the API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Login User
const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success: false, message: "User not Exists"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({success: false, message: "Invalid Credentials"});
    }

    const token = createToken(user._id);
    return res.json({
      success: true,
      message: "User Logged In!",
      token,
      user: {
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({success: false, message: "Error!"});
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success: false, message: "Admin not Exists"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({success: false, message: "Invalid Credentials"});
    }

    if (user.role !== "admin") {
      return res.json({success: false, message: "Not Authorized as Admin"});
    }

    const token = createToken(user._id);
    return res.json({
      success: true,
      message: "Admin Logged In!",
      token,
      user: {
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({success: false, message: "Error!"});
  }
};

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"});
};

//Register User
const registerUser = async (req, res) => {
  const {name, password, email} = req.body;
  try {
    //Checking user already exists
    const exists = await userModel.findOne({email});
    if (exists) {
      return res.json({success: false, message: "User Already Exists"});
    }
    //Validating email format and strong
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: "Please enter valid Email"});
    }
    if (password.length <= 6) {
      return res.json({
        success: false,
        message: "Please enter strong Password",
      });
    }

    //Hasing User Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      message: "User Registered successfully",
      user: {
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error,User Not registered!"});
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Logout failed",
    });
  }
};

// Send Reset OTP
const sendResetOtp = async (req, res) => {
  const {email} = req.body;
  try {
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success: false, message: "User not found"});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const msg = {
      to: email,
      from: {
        email: process.env.SENDER_EMAIL,
        name: "Tomato Support",
      },
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #ff4c24; text-align: center;">Password Reset Request</h2>
          <p>Hello <b>${user.name}</b>,</p>
          <p>We received a request to reset your password. Use the verification code below to proceed:</p>
          <div style="background-color: #f7fafc; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a202c; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #4a5568;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">Tomato Food Delivery App</p>
        </div>
      `,
    };

    console.log(`OTP generated for ${email}: ${otp}`);
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${email}`);
    res.json({success: true, message: "OTP sent to your email"});
  } catch (error) {
    console.error("SendGrid Error:", error.response ? error.response.body : error);
    res.json({success: false, message: "Error sending OTP. Please try again later."});
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const {email, otp} = req.body;
  try {
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success: false, message: "User not found"});
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({success: false, message: "Invalid OTP"});
    }

    if (user.resetOtpExpire < Date.now()) {
      return res.json({success: false, message: "OTP Expired"});
    }

    res.json({success: true, message: "OTP Verified"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error verifying OTP"});
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const {email, otp, newPassword} = req.body;
  try {
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success: false, message: "User not found"});
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({success: false, message: "Invalid OTP"});
    }

    if (user.resetOtpExpire < Date.now()) {
      return res.json({success: false, message: "OTP Expired"});
    }

    if (newPassword.length < 6) {
      return res.json({success: false, message: "Password must be at least 6 characters"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpire = null;
    await user.save();

    res.json({success: true, message: "Password updated successfully"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error updating password"});
  }
};

export {
  loginUser,
  loginAdmin,
  registerUser,
  logoutUser,
  sendResetOtp,
  verifyOtp,
  resetPassword,
};
