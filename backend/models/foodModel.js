import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least 1"],
      max: [10000, "Price too high"],
    },

    image: {
      type: String,
      required: [true, "Image URL is required"],
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|webp)$/i.test(v);
        },
        message: "Image must be JPG, PNG, or WEBP format",
      },
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Salad",
          "Rolls",
          "Deserts",
          "Sandwich",
          "Cake",
          "Pure Veg",
          "Pasta",
          "Noodles",
        ],
        message: "Invalid category",
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

const foodModel = mongoose.models.food || mongoose.model("Food", foodSchema);

export default foodModel;
