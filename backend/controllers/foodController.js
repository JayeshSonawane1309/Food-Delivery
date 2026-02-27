import foodModel from "../models/foodModel.js";

import fs from "fs";

//Add food Item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({success: true, message: "Food Added"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Data does not get Added"});
  }
};

//All foodList
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({success: true, data: foods});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error"});
  }
};

//Remove food Item
const removeFood = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.json({
        success: false,
        message: "Id not given found",
      });
    }
    const food = await foodModel.findByIdAndDelete(id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found",
      });
    }
    console.log(food);

    // Delete image
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.log("Error deleting file");
    });

    res.json({
      success: true,
      message: "Food Item get deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "food Item not get deleted",
    });
  }
};

export {addFood, listFood, removeFood};
