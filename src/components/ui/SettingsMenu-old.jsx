import React from "react";
import { Menu } from "antd";
import { FaUser } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

const items = [
  getItem("Profile", "1", <FaUser size={"1.25em"} />),
  getItem("Account", "2", <MdManageAccounts size={"1.25em"} />),
];

const SettingsMenu = (props) => {
  const onClick = (e) => {
    console.log("Settings item clicked: ", e.key);
    props.selectedSetting(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      style={{
        width: "250px",
        borderRadius: "15px",
        marginLeft: "10px",
      }}
      defaultSelectedKeys={["1"]}
      mode={"inline"}
      items={items}
    />
  );
};

export default SettingsMenu;
