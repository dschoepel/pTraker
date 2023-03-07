import React, { useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { DashboardOutlined, UploadOutlined } from "@ant-design/icons";
import { BsFolder2Open } from "react-icons/bs";

import AuthContext from "../store/auth.context";
// import { sideMenuItems } from "./SideMenuItems";

import "./SideMenu.css";

const iconStyle = { color: "var(--dk-gray-500)" };

function SideMenu({ selectedKey }) {
  const authCtx = useContext(AuthContext);

  const sideMenuItems = [
    {
      key: "s1",
      icon: <BsFolder2Open style={iconStyle} />,
      label: "side 1",
    },
    {
      key: "s2",
      icon: <UploadOutlined style={iconStyle} />,
      label: "side 2",
    },
  ];

  return (
    <Menu
      className="side-menu"
      theme="dark"
      mode="vertical"
      defaultSelectedKeys={[selectedKey]}
      items={sideMenuItems}
    ></Menu>
  );
}

export default SideMenu;
