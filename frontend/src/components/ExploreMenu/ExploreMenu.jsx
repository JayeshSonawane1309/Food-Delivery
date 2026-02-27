import React from "react";
import "./ExploreMenu.css";
import {menu_list} from "../../assets/frontend_assets/assets";

const ExploreMenu = ({category, setCategory}) => {
  //   console.log(category);

  let clickHandler = (item) => {
    setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name));
  };

  return (
    <div className="ExploreMenu" id="ExploreMenu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your carvings and elevate your dining experience,
        one delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() => {
                clickHandler(item);
              }}
              className="explore-menu-list-item"
              key={index}>
              <img
                className={category === item.menu_name ? "item-active" : ""}
                src={item.menu_image}
                alt={`${item.menu_name} png`}
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
