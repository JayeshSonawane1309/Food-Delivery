import React, {useEffect, useContext} from "react";
import "./Verify.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import {StoreContext} from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {URL, setCartItems} = useContext(StoreContext);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          URL + "/api/order/verify",
          {success, orderId},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          },
        );

        if (response.data.success) {
            setCartItems({});
          navigate("/myorders");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };

    if (orderId) {
      verifyPayment();
    }
  }, [orderId, success, URL, navigate]);

  return (
    <div className="Verify">
      <div className="loader-wrapper">
        <div className="spinner"></div>
        <p>Verifying your payment...</p>
      </div>
    </div>
  );
};

export default Verify;
