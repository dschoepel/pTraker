import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert, Layout } from "antd";

import AuthService from "../services/auth.service";
import PortfolioService from "../services/portfolio.service";
import AuthContext from "../store/auth.context";
import { ImageContext } from "../store/image.context";
import { contentStyle } from "../ui/ContentStyle";

const { Content } = Layout;
// const { Link } = Typography;

function Logout() {
  const [, setImageContext] = useContext(ImageContext);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    console.log("authCtx.alogout()");
    PortfolioService.setLocalPortfolioId("");
    authCtx.aLogout();
    AuthService.logout();
    setImageContext(null);
  }, [authCtx, setImageContext]);

  console.log("authCtx.alogout()");
  // authCtx.aLogout();
  // console.log("authCtx.alogout()");
  console.log("Authservice.logout()");
  console.log("setImageContext(null)");
  return (
    <Content style={contentStyle}>
      <Alert
        banner={true}
        type="success"
        message="Logout"
        description="You have been logged out..."
        action={
          <Link reloadDocument to="/">
            Close
          </Link>
        }
      />
    </Content>
  );
}

export default Logout;
