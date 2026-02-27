import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },

    address: {
      firstName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email"],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10}$/, "Enter valid 10-digit phone number"],
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
        match: [/^[0-9]{6}$/, "Enter valid pincode"],
      },
      country: {
        type: String,
        default: "India",
      },
    },

    status: {
      type: String,
      enum: ["Food Processing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Food Processing",
    },

    payment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
