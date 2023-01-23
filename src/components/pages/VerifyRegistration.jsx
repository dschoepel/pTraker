import React from "react";
import { Alert, Layout, Typography } from "antd";

import { contentStyle } from "../ui/ContentStyle";

const { Content } = Layout;
const { Link } = Typography;

function VerifyRegistration() {
  return (
    <Content style={contentStyle}>
      <Alert
        banner={true}
        type="success"
        message="Account Created Pending Verification"
        description="A link was sent to your E-mail account.  Please check your inbox and click on the link to verify your e-mail and activate your account.  Once activated, you can login to your account."
        action={<Link href="/">Close</Link>}
      />
    </Content>
  );
}

export default VerifyRegistration;
