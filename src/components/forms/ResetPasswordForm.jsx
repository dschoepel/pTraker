import React, { useState, useRef, useEffect, Fragment } from "react";
import { Form, Button, Input, Alert, message, Space, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";

import AuthService from "../services/auth.service";
import "./ResetPasswordForm.css";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [eMessage, setEMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [emailInputDisabled, setEmailInputDisabled] = useState(false);
  const emailInput = useRef(null);

  const successMessage = (
    <Space className="reset-password" direction="vertical">
      <Typography.Text type="success">
        Your password reset mail should arrive shortly.
      </Typography.Text>
      <Typography.Text type="success">
        If you don't see it, please check your spam folder, sometimes it can end
        up there!
      </Typography.Text>
    </Space>
  );

  useEffect(() => {
    if (emailInput.current) {
      emailInput.current.focus();
    }
  }, [emailInput]);

  function onFinish(values) {
    // setLoading(true);
    AuthService.requestPasswordReset(email)
      .then(function (response) {
        setEMessage("");
        const { success, statusCode, data } = response;
        const { message: errorMsg, errorStatus, errorFlag } = data;

        console.log("Success: ", success);
        if (!errorFlag) {
          console.log("Response: ", data, statusCode);
          message.success({
            content:
              "Password reset email sent, check inbox for link to reset password",
            duration: 1,
            style: { marginTop: "20vh" },
          });
          setEMessage(errorMsg);
          setEmailInputDisabled(true);
          setVerified(true);
        } else {
          if (statusCode === 404) {
            console.log(
              "Response: ",
              errorMsg,
              errorStatus,
              errorFlag,
              statusCode
            );
            switch (errorStatus) {
              case "EMAIL_NOT_FOUND":
                setEMessage(errorMsg);
                setVerified(false);
                break;
              default:
            }
          } else {
            setEMessage("");
            setVerified(true);
          }
        }
      })
      .catch(function (error) {
        console.log("Catch: ", error);
        setEMessage(error.toString());
        setVerified(false);
      })
      .finally(function () {
        // setLoading(false);
      });
  }

  const onValuesChange = ({ email }) => {
    if (email) {
      setEmail(email.toLowerCase());
    }
  };

  return (
    <>
      <Form
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
            addonBefore={<MailOutlined />}
            allowClear
            placeholder="Enter email address"
            ref={emailInput}
            disabled={emailInputDisabled}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Send Password Reset Email
          </Button>
        </Form.Item>

        {eMessage && !verified ? (
          <Alert message={eMessage} type="error" showIcon />
        ) : null}
        {verified ? successMessage : null}
      </Form>
    </>
  );
};

export default ResetPasswordForm;
