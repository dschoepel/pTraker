import React from "react";
import { Menu } from "antd";
// import {} from '@ant-design/icons'

import { sideMenuItems } from "./SideMenuItems";

import "./SideMenu.css";

function SideMenu({ selectedKey }) {
  return (
    <Menu
      className="side-menu"
      // theme="dark"
      mode="vertical"
      defaultSelectedKeys={[selectedKey]}
      items={sideMenuItems}
    ></Menu>
  );
}

export default SideMenu;
