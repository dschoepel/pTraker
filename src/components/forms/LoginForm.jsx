import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Input, Alert, Spin, Space, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

import AuthService from "../services/auth.service";
import PortfolioService from "../services/portfolio.service";
import TokenService from "../services/token.service";
import AuthContext from "../store/auth.context";
import { ImageContext } from "../store/image.context";

import "./LoginForm.css";

const LoginForm = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [eMessage, setEMessage] = useState("");
  const [verified, setVerified] = useState(true);
  const [, setImageContext] = useContext(ImageContext);

  const authCtx = useContext(AuthContext);
  const emailInput = useRef(null);

  useEffect(() => {
    if (emailInput.current) {
      emailInput.current.focus();
    }
  }, [emailInput]);

  // Cancel button clicked, show home page
  const onCancel = () => {
    navigate("/");
  };

  function onFinish(values) {
    setLoading(true);
    AuthService.login(email, password)
      .then(function (response) {
        setEMessage("");
        const { success, statusCode, data } = response;
        const { message: errorMsg, errorStatus, errorFlag } = data;

        console.log("Success: ", success);
        if (!errorFlag) {
          console.log("Response: ", data, statusCode);
          message.success({
            content: "Login was successful",
            duration: 1,
            style: { marginTop: "20vh" },
          });
          setEMessage("");
          authCtx.aLogin(data.accessToken);
          const { profileImage } = TokenService.getUser();
          setImageContext(profileImage);
          console.log(authCtx.profileImage);
          // Get portfolios for user and set first one...
          const toPortfolio = PortfolioService.getLocalPortfolioId();
          console.log("Logging in defaulte portfolio id: ", toPortfolio);
          navigate(`/dashboard/${toPortfolio}`);
          // window.location.reload(false);
        } else {
          if (statusCode === 401) {
            console.log(
              "Response: ",
              errorMsg,
              errorStatus,
              errorFlag,
              statusCode
            );
            switch (errorStatus) {
              case "INVALID_PASSWORD":
                setEMessage(errorMsg);
                break;
              case "EMAIL_NOT_VERIFIED":
                setEMessage("Your e-mail has not been validated!");
                setVerified(false);
                setEmail(values.email);
                break;
              case "EMAIL_NOT_FOUND":
                setEMessage(errorMsg);
                break;
              default:
            }
          } else {
            setEMessage(errorMsg);
            setVerified(true);
          }
        }
      })
      .catch(function (error) {
        console.log("Catch: ", error);
        setEMessage(error.toString());
      })
      .finally(function () {
        setLoading(false);
      });
  }

  const onValuesChange = ({ email, password }) => {
    // console.log("Changed Values:", changedValues);
    // console.log("allValues:", allValues);
    if (email) {
      setEmail(email.toLowerCase());
    }
    if (password) {
      setPassword(password.trim());
    }
  };

  const clickedResendEmail = () => {
    authCtx.trackEmail(email);
    navigate("/emailReVerification");
  };

  return (
    <>
      <Form
        className="login-form-style"
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        autoComplete="off"
      >
        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            { required: true, message: "Please input your Email address!" },
            { type: "email", message: "The input is not a valid E-mail" },
          ]}
          hasFeedback
        >
          <Input
            className="login-form-addon-icon"
            addonBefore={<MailOutlined />}
            allowClear
            placeholder="Enter email address"
            ref={emailInput}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password
            className="login-form-addon-icon"
            addonBefore={<LockOutlined />}
            placeholder="Enter password"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Space>
        </Form.Item>

        {eMessage && verified ? (
          <Alert message={eMessage} type="error" showIcon />
        ) : null}
        {eMessage && !verified ? (
          <Alert
            message={eMessage}
            showIcon
            description={`Check your "${email}" inbox for the link to validate your e-mail or Resend it...`}
            type="error"
            action={
              <Button size="small" danger onClick={clickedResendEmail}>
                Resend E-mail
              </Button>
            }
          />
        ) : null}
        {loading && <Spin tip="Logging in..." />}
      </Form>
    </>
  );
};

export default LoginForm;
