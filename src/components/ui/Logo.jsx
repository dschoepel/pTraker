import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

import "./Logo.css";

const BASE_APP_URL = process.env.REACT_APP_PTRACKER_APP_BASE_URL;

function Logo(props) {
  const ptrackerLogo = BASE_APP_URL + "/pTracker_icon1.png";
  console.log(process.env.REACT_APP_PTRACKER_APP_BASE_URL, ptrackerLogo);
  const { collapsed } = props;
  return (
    <Tooltip title="Dashboard">
      <Link to="/">
        <div className="pt-logo">
          <img
            className="pt-img"
            src={ptrackerLogo}
            alt="portfolio Traker Logo"
          />
          {!collapsed ? (
            <>
              <div className="pt-text1">portfolio</div>
              <div className="pt-text2">Traker</div>
            </>
          ) : null}
        </div>
      </Link>
    </Tooltip>
  );
}

export default Logo;
