import React from "react";
import { Layout, Typography } from "antd";

import { contentStyle } from "../ui/ContentStyle";

const { Content } = Layout;
const { Title } = Typography;

function Template() {
  return (
    <Content style={contentStyle}>
      <Title level={1}>h1. Title </Title>
    </Content>
  );
}

export default Template;
