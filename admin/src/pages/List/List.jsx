import React, {useEffect, useState} from "react";
import "./List.css";

import axios from "axios";
import {toast} from "react-toastify";

const List = ({URL, token}) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${URL}/api/food/list`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Failed to fetch list", {
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

  const removeFood = async (foodId) => {
    const response = await axios.post(
      `${URL}/api/food/remove`,
      {id: foodId},
      {headers: {token}},
    );
    if (response.data.success) {
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: "linear-gradient(135deg, #ff4c24, #ff6a3d)",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
    }
    await fetchList();
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="List flex-col">
      <p>All foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div className="list-table-format" key={index}>
              <img src={`${URL}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p
                onClick={() => {
                  removeFood(item._id);
                }}
                className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
