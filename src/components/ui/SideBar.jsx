import React, { useContext } from "react";
import { Layout } from "antd";
// import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// import {} from "react-icons/bs";

import "./SideBar.css";
import AuthContext from "../store/auth.context";
import Logo from "./Logo";
import SideMenu from "./SideMenu";
import DashboardMenu from "./DashboardMenu";

const { Sider } = Layout;

function SideBar({ collapsed, listChanged, setListChanged }) {
  const { isLoggedIn } = useContext(AuthContext);
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
      {isLoggedIn ? (
        <DashboardMenu
          listChanged={listChanged}
          setListChanged={setListChanged}
        />
      ) : null}
      <SideMenu />
    </Sider>
  );
}

export default SideBar;
