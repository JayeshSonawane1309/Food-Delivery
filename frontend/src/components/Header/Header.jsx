import React from "react";
import "./Header.css";
import {useNavigate} from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="Header">
      <div className="header-content">
        <h2>Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our
          platform ensures fresh preparation, hygienic packaging, and quick
          delivery right to your doorstep.
        </p>
        <button
          onClick={() => {
            const element = document.getElementById("ExploreMenu");
            if (element) {
              element.scrollIntoView({behavior: "smooth"});
            }
          }}>
          View Menu
        </button>
      </div>
    </div>
  );
};

export default Header;
