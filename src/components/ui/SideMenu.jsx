import React, { useContext } from "react";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DashboardOutlined, UploadOutlined } from "@ant-design/icons";
import { ImNewspaper } from "react-icons/im";

import AuthContext from "../store/auth.context";
// import { sideMenuItems } from "./SideMenuItems";

import "./SideMenu.css";

const iconStyle = { color: "var(--dk-gray-500)" };

function SideMenu({ selectedKey }) {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const menuClicked = ({ key }) => {
    console.log("Menu clicked: ", key);
    navigate(`/${key}`);
  };

  const sideMenuItems = [
    {
      key: "news",
      icon: <ImNewspaper style={iconStyle} />,
      label: "Financial News",
    },
    {
      key: "upload",
      icon: <UploadOutlined style={iconStyle} />,
      label: "Upload",
    },
  ];

  return (
    <Menu
      className="side-menu"
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[selectedKey]}
      items={sideMenuItems}
      onClick={menuClicked}
    ></Menu>
  );
}

export default SideMenu;
