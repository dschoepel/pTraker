import React from "react";
import { Menu } from "antd";
import { FaUser } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";

import "./SettingsMenu.css";

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

const items = [
  getItem(
    "Profile",
    "1",
    <FaUser size={"1.25em"} style={{ color: "var(--dk-gray-500)" }} />
  ),
  getItem(
    "Account",
    "2",
    <MdManageAccounts size={"1.25em"} style={{ color: "var(--dk-gray-500)" }} />
  ),
];

const SettingsMenu1 = (props) => {
  const onClick = (e) => {
    console.log("Settings item clicked: ", e.key);
    props.selectedSetting(e.key);
  };

  return (
    <Menu
      className="settings-menu-items"
      onClick={onClick}
      style={{
        width: "200px",
        backgroundColor: "var(--dk-darker-bg)",
        color: "var(--dk-gray-500)",

        //   // borderRadius: "15px",
        //   // marginLeft: "10px",
      }}
      // theme="dark"
      defaultSelectedKeys={["1"]}
      mode={"inline"}
      items={items}
    />
  );
};

export default SettingsMenu1;
