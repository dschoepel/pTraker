import React, { useContext, useState } from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { CaretDownFilled } from "@ant-design/icons";

import { ImageContext } from "../store/image.context";
import AuthService from "../services/auth.service";
import AuthContext from "../store/auth.context";
import HeadingMenuItems from "./HeadingMenuItems";

import "./HeadingMenu.css";

function HeadingMenu({ selectedKey }) {
  const [imageContext] = useContext(ImageContext);
  const { menuItems } = HeadingMenuItems();
  const authCtx = useContext(AuthContext);
  const [im] = useState(authCtx.profileImage);

  const BASE_URL = process.env.REACT_APP_PTRACKER_API_BASE_URL;
  const avatar = BASE_URL + "/images/" + imageContext;
  console.log("Image: ", im, avatar);
  // function wait(ms) {
  //   var start = new Date().getTime();
  //   var end = start;
  //   while (end < start + ms) {
  //     end = new Date().getTime();
  //   }
  // }

  const onClick = ({ key }) => {
    if (key === "logout") {
      AuthService.logout();
      // alert("Successfuly logged out...");
    }
  };

  return (
    <>
      <Menu
        expandIcon={<CaretDownFilled />}
        className="pt-heading-menu"
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[selectedKey]}
        items={menuItems}
        onClick={onClick}
      ></Menu>
    </>
  );
}

export default HeadingMenu;
