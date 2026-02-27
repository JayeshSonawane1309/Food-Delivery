import React, {useContext, useState} from "react";
import "./FoodItem.css";
import {assets} from "../../assets/frontend_assets/assets";

import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import {StoreContext} from "../../context/StoreContext";

const FoodItem = ({id, name, price, description, image, rating}) => {
  const {cartItems, addToCart, removeFromCart, URL} = useContext(StoreContext);

  return (
    <div className="Food-Item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={URL + "/images/" + image}
          alt={`${name} png`}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => {
              addToCart(id);
            }}
            src={assets.add_icon_white}
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => {
                removeFromCart(id);
              }}
              src={assets.remove_icon_red}
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => {
                addToCart(id);
              }}
              src={assets.add_icon_green}
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>

          <Stack spacing={1} className="rating">
            <Rating
              className="rating-value"
              name={`rating-${id}`}
              value={rating}
              precision={0.5}
              readOnly
            />
          </Stack>
        </div>

        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
