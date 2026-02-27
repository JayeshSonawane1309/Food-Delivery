import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Placing order from frontend
const placeOrder = async (req, res) => {
  try {
    const frontendURL = "http://localhost:5173";

    const {items, totalAmount, address} = req.body;
    const userId = req.body.userId;

    const newOrder = new orderModel({
      userId,
      items,
      totalAmount,
      address,
      status: "Food Processing",
      payment: false,
    });

    const savedOrder = await newOrder.save();

    //Create Stripe line Items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80, // convert to paise
      },
      quantity: item.quantity,
    }));
    //Delivery Charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontendURL}/verify?success=true&orderId=${savedOrder._id}`,
      cancel_url: `${frontendURL}/verify?success=false&orderId=${savedOrder._id}`,
    });

    res.json({success: true, session_url: session.url});
  } catch (error) {
    console.log(error);
    res.json({success: true, message: "Payment Failed"});
  }
};

const verifyOrder = async (req, res) => {
  const {orderId, success} = req.body;

  try {
    if (success === "true") {
      // 1️⃣ Update order payment
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        {$set: {payment: true}},
        {new: true},
      );

      if (!order) {
        return res.json({success: false, message: "Order not found"});
      }

      // 2️⃣ Clear user's cart using order.userId
      await userModel.findByIdAndUpdate(order.userId, {
        $set: {cartData: {}},
      });

      return res.json({
        success: true,
        message: "Payment was Successful",
      });
    } else {
      // ❌ Delete order if payment failed
      await orderModel.findByIdAndDelete(orderId);

      return res.json({
        success: false,
        message: "Payment was Declined!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while verifying payment",
    });
  }
};

//Userorder fro Frontend
const userOrder = async (req, res) => {
  try {
    const orders = await orderModel
      .find({userId: req.body.userId})
      .sort({createdAt: -1});

    res.json({success: true, data: orders});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error!"});
  }
};

//Listing all orders
const listOrders = async (req, res) => {
  try {
    let orders = await orderModel.find({});
    res.json({success: true, data: orders});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error!"});
  }
};

//Update Order Status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({success: true, message: "Status Updated!"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error!"});
  }
};

export {placeOrder, verifyOrder, userOrder, listOrders, updateStatus};
