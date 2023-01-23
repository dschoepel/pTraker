import React, { useContext } from "react";
import { Layout, Card } from "antd";

import usePublicContent from "../hooks/usePublicContent";
import { contentStyle } from "../ui/ContentStyle";
import "./PublicHome.css";

import { ImageContext } from "../store/image.context";
import AuthContext from "../store/auth.context";

const { Content } = Layout;
const PublicHome = () => {
  const [imageContext] = useContext(ImageContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { publicContent } = usePublicContent();

  return (
    <Content style={contentStyle}>
      <Card
        className="pt-card-style"
        // title="Welcome to Your Dashboard"
        bordered={false}
        // style={{ width: "100%" }}
        style={{
          width: "100%",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <h1 style={{ fontSize: "150%", color: "var(--dk-gray-100" }}>
          Public Home: Welcome to Your Dashboard
        </h1>
        <h1>Content: {publicContent}</h1>
        <p>IsLoggedIn: {isLoggedIn ? "true" : "false"}</p>
        <p>profileImage: {imageContext}</p>
      </Card>
    </Content>
  );
};

export default PublicHome;
