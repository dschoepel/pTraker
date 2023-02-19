import React from "react";
import { Layout } from "antd";
// import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// import {} from "react-icons/bs";

import "./SideBar.css";

import Logo from "./Logo";
import SideMenu from "./SideMenu";

const { Sider } = Layout;

function SideBar({ collapsed }) {
  return (
    <Sider
      className="side-bar"
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="sm"
      width="var(--sidebar-width)"
      collapsedWidth="60"
    >
      <Logo collapsed={collapsed} />
      <SideMenu selectedKey={"3"} />
    </Sider>
  );
}

export default SideBar;
