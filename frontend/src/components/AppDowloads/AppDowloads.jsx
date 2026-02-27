import React from "react";
import "./AppDownloads.css";
import {assets} from "../../assets/frontend_assets/assets";

const AppDowloads = () => {
  return (
    <div className="App-Downloads" id="App-Downloads">
      <p>
        For Better Experience Download <br />
        Tomato App
      </p>
      <div className="app-download-platform">
        <img src={assets.app_store} />
        <img src={assets.play_store} />
      </div>
    </div>
  );
};

export default AppDowloads;
