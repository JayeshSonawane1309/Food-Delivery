import userModel from "../models/userModel.js";

//Add items to userCart
const addToCart = async (req, res) => {
  try {
    let userId = req.body.userId;
    let userData = await userModel.findOne({_id: userId});

    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, {
      $set: {cartData: cartData},
    });

    res.json({success: true, message: "Added to Cart"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while Adding Data"});
  }
};

//Remove items from cart
const removeFromCart = async (req, res) => {
  try {
    let userId = req.body.userId;
    let userData = await userModel.findOne({_id: userId});

    let cartData = userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    if (cartData[req.body.itemId] === 0) {
      delete cartData[req.body.itemId.toString];
    }

    await userModel.findByIdAndUpdate(userId, {
      $set: {cartData: cartData},
    });

    res.json({success: true, message: "Removed from the Cart"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while removing"});
  }
};

//Fetch User Cart data
const getCart = async (req, res) => {
  try {
    let userId = req.body.userId;
    let userData = await userModel.findOne({_id: userId});

    let cartData = await userData.cartData;

    res.json({success: true, cartData: cartData});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error!"});
  }
};

export {addToCart, removeFromCart, getCart};
