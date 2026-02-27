import React, {useEffect, useState} from "react";
import "./Orders.css";
import axios from "axios";
import {toast} from "react-toastify";
import {assets} from "../../assets/admin_assets/assets";

const Orders = ({URL, token}) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    let response = await axios.get(URL + "/api/order/list", {headers: {token}});
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error!", {
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

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(
      URL + "/api/order/status",
      {
        orderId,
        status: event.target.value,
      },
      {headers: {token}},
    );
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="Orders">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + " , ";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      "," +
                      order.address.state +
                      "," +
                      order.address.country +
                      "," +
                      order.address.pincode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p className="total-items">Items : {order.items.length}</p>
              <p className="order-amount">${order.totalAmount}</p>
              <select
                onChange={(event) => {
                  statusHandler(event, order._id);
                }}
                value={order.status}
                className={`status-select ${order.status.replace(/\s/g, "")}`}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
