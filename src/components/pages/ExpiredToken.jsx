import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

import AuthService from "../services/auth.service";
import PortfolioService from "../services/portfolio.service";
import AuthContext from "../store/auth.context";
import { ImageContext } from "../store/image.context";

function ExpiredToken() {
  const authCtx = useContext(AuthContext);
  const [, setImageContext] = useContext(ImageContext);
  const navigate = useNavigate();

  const onClickLogin = () => {
    console.log("Clicked Login");
    PortfolioService.setLocalPortfolioId("");
    authCtx.aLogout();
    AuthService.logout();
    setImageContext(null);
    navigate("/login");
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Your login has expired, relogin to restart your session"
      extra={
        <Button type="primary" onClick={onClickLogin}>
          Login
        </Button>
      }
    />
  );
}

export default ExpiredToken;
