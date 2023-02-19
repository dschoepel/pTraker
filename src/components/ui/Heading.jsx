import React, { useContext } from "react";

import { Layout, Button, Typography, Space } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import AuthContext from "../store/auth.context";
import HeadingMenu from "./HeadingMenu";

import "./Heading.css";

const { Header } = Layout;

function Heading({ toggleCollapsed, collapsed }) {
  const { isLoggedIn } = useContext(AuthContext);

  const headerStyle = {
    padding: 0,
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    backgroundColor: "var(--navbar-bg-color)",
  };

  const buttonStyle = {};
  return (
    <Header style={headerStyle} className="header-container">
      <Button style={buttonStyle} type="text" onClick={toggleCollapsed}>
        {collapsed ? (
          <MenuUnfoldOutlined
            style={{ fontSize: "150%", color: "var(--dk-gray-100)" }}
          />
        ) : (
          <MenuFoldOutlined
            style={{ fontSize: "150%", color: "var(--dk-gray-100)" }}
          />
        )}
      </Button>

      {!isLoggedIn ? (
        <Space wrap={true} size="middle">
          <Typography.Link
            href="/login"
            style={{
              color: "var(--dk-gray-100)",
              fontSize: "150%",
              fontWeight: "bold",
            }}
          >
            Login
          </Typography.Link>
          <Typography.Link
            href="/register"
            style={{
              color: "var(--dk-gray-100)",
              fontSize: "150%",
              marginRight: "1rem",
              fontWeight: "bold",
            }}
          >
            Signup
          </Typography.Link>
        </Space>
      ) : null}
      {isLoggedIn ? (
        <Space>
          {/* <div
            style={{
              color: "var(--dk-gray-100)",
              fontSize: "150%",
              width: "5em",
              // height: "60px",
              wordWrap: "break-word",
            }}
          >
            <Typography.Paragraph>Dave Schoepel</Typography.Paragraph>
          </div> */}
          <HeadingMenu selectedKey={"myProfile"}></HeadingMenu>
        </Space>
      ) : null}
    </Header>
  );
}

export default Heading;
