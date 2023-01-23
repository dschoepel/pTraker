import React, { useContext, useState } from "react";
import { Typography, Button, Result, Layout } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";

import AuthContext from "../store/auth.context";
import useVerifyEmail from "../hooks/useVerifyEmail";
import "./EmailVerification.css";
import { contentStyle } from "../ui/ContentStyle";

const { Text } = Typography;
const { Content } = Layout;

function VerifyEmail1(props) {
  const [confirming, setConfirming] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [eMessage, setEMessage] = useState("");
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  useVerifyEmail(
    verificationToken,
    setSuccessMessage,
    setVerifiedEmail,
    setConfirmed,
    setEMessage,
    setConfirming
  );

  const onClickLogin = () => {
    navigate("/login");
  };

  const onClickEmailVerification = () => {
    authCtx.trackEmail(verifiedEmail);
    navigate("/emailReVerification");
  };

  return (
    <Content style={contentStyle}>
      {confirming ? (
        <ThreeCircles
          height="150"
          width="150"
          color="var(--navbar-bg-color)"
          innerCircleColor="var(--dk-dark-bg)"
          middleCircleColor="var(--dk-darker-bg)"
          ariaLabel="three-circles-rotating"
          wrapperStyle={{}}
          wrapperClass="spinner-container"
        />
      ) : (
        <Text>
          {confirmed ? (
            <Result
              status="success"
              title={successMessage}
              extra={
                <Button onClick={onClickLogin} type="primary" key="login">
                  Login
                </Button>
              }
            />
          ) : (
            <Result
              status="error"
              title={successMessage}
              subTitle={eMessage}
              extra={
                <Button
                  onClick={onClickEmailVerification}
                  type="primary"
                  key="emailReVerification"
                >
                  Re-Verify E-mail
                </Button>
              }
            />
          )}
        </Text>
      )}
      {confirming ? (
        <div className="tip-container">
          <p className="tip">Verifying your e-mail...</p>
        </div>
      ) : null}
    </Content>
  );
}

export default VerifyEmail1;
