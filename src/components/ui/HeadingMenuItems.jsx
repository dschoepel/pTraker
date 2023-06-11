import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { ImageContext } from "../store/image.context";
import AuthContext from "../store/auth.context";
import TokenService from "../services/token.service";

import {
  QuestionCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";

import { HiUserAdd } from "react-icons/hi";

const BASE_URL = process.env.REACT_APP_PTRACKER_API_BASE_URL;

function HeadingMenuItems() {
  const [imageContext] = useContext(ImageContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [avatarImage, setAvatarImage] = useState(
    isLoggedIn
      ? BASE_URL + "/images/" + imageContext
      : BASE_URL + "/images/defaultperson.png"
  );
  const [userName] = useState(TokenService.getUserName);

  useEffect(() => {
    const image = BASE_URL + "/images/" + imageContext;
    if (image !== avatarImage) {
      setAvatarImage(image);
    }
  }, [avatarImage, imageContext]);
  // Set login or logout option
  const logKeyval = isLoggedIn ? "logout" : "login";
  const logIcon = isLoggedIn ? <LogoutOutlined /> : <LoginOutlined />;
  const logLabelval = isLoggedIn ? (
    <Link style={{ fontSize: "large" }} to="/logout">
      Logout
    </Link>
  ) : (
    <Link style={{ fontSize: "large" }} to="/login">
      Login
    </Link>
  );

  const getImage = () => {
    setAvatarImage(
      isLoggedIn && TokenService.getUserProfileImage().length > 0
        ? BASE_URL + "/images/" + TokenService.getUserProfileImage()
        : BASE_URL + "/images/defaultperson.png"
    );
  };
  // Set Signup or My Profile option
  const spKeyval = isLoggedIn ? "settings" : "signup";
  // var imageSrc =
  //   isLoggedIn && TokenService.getUserProfileImage().length > 0
  //     ? BASE_URL + "/images/" + TokenService.getUserProfileImage()
  //     : BASE_URL + "/images/defaultperson.png";
  // if (isLoggedIn && TokenService.getUserProfileImage().length > 0) {
  //   imageSrc = BASE_URL + "/images/" + TokenService.getUserProfileImage();
  // }
  const spIcon = isLoggedIn ? <SettingOutlined /> : <HiUserAdd />;
  const spLabelval = isLoggedIn ? (
    <Link style={{ fontSize: "large" }} to="/myProfile">
      Settings
    </Link>
  ) : (
    <Link style={{ fontSize: "large" }} to="/register">
      Signup
    </Link>
  );

  const menuItems = [
    {
      key: "Submenu",
      icon: (
        <Tooltip placement="left" title={userName}>
          <Avatar
            style={{
              marginTop: "2rem",
              boxShadow: "0 3px 10px rgb(0 0 0 / 0.5)",
            }}
            size={{
              xs: 24,
              sm: 32,
              md: 40,
              lg: 48,
              xl: 56,
              xxl: 64,
            }}
            shape="square"
            src={avatarImage}
          />
        </Tooltip>
      ),
      children: [
        {
          key: spKeyval,
          icon: spIcon,
          label: spLabelval,
        },
        {
          key: "help",
          icon: <QuestionCircleOutlined />,
          label: "Help",
        },
        { type: "divider" },
        {
          key: logKeyval,
          icon: logIcon,
          label: logLabelval,
        },
      ],
    },
  ];

  return { menuItems };
}

export default HeadingMenuItems;
