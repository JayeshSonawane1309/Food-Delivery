import React, {useState} from "react";
import {assets} from "../../assets/admin_assets/assets";
import "./Add.css";

import axios from "axios";
import {toast} from "react-toastify";

const Add = ({apiURL, token}) => {
  const [image, setImage] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  const ChangeHandler = (event) => {
    setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log("Form Data:", data);
    // console.log("Image:", image);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    formData.append("image", image);

    const response = await axios.post(`${apiURL}/api/food/add`, formData, {
      headers: {token},
    });

    if (response.data.success) {
      // Reset form
      setData({
        name: "",
        description: "",
        category: "",
        price: "",
      });
      setImage(false);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
        style: {
          background: "linear-gradient(135deg, #ff4c24, #ff6a3d)",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
    } else {
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: "linear-gradient(135deg, #574545, #675050)",
          color: "red",
          borderRadius: "14px",
          fontWeight: "600",
          fontFamily: "Outfit",
        },
      });
    }
  };

  const imageChangeHandle = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={handleSubmit}>
        {/* Upload */}
        <div className="add-img-upload">
          <p>Upload Images</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            name="image"
            onChange={imageChangeHandle}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        {/* Name */}
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            type="text"
            name="name"
            placeholder="Enter name of product"
            value={data.name}
            onChange={ChangeHandler}
            required
          />
        </div>

        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            rows={6}
            placeholder="Write content here"
            value={data.description}
            onChange={ChangeHandler}
            required
          />
        </div>

        {/* Category + Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              name="category"
              value={data.category}
              onChange={ChangeHandler}
              required>
              <option value="">Select category below</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="number"
              name="price"
              placeholder="$15"
              value={data.price}
              onChange={ChangeHandler}
              required
            />
          </div>
        </div>

        <button type="submit" className="add-button">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
