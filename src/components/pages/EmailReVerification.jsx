import React, { useState, useContext } from "react";
import { Layout, Form, Button, Input, Card, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";

import AuthContext from "../store/auth.context";
import ReVerifyEmail from "../services/reverifyemail.service";
import { contentStyle } from "../ui/ContentStyle";

const { Content } = Layout;

function EmailReVerification(props) {
  const authCtx = useContext(AuthContext);
  const [email, setEmail] = useState(authCtx.email);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const onFinish = (values) => {
    console.log(email);
    ReVerifyEmail.reVerifyEmail(
      email,
      setEmailSent,
      setErrorMessage,
      setHasErrors,
      setIsVerified
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login Failed: ", errorInfo);
  };

  const onValuesChange = (changedValues) => {
    if (changedValues?.email) {
      setEmail(changedValues.email);
    }
  };

  return (
    <Content style={contentStyle}>
      <Card
        title="Account Verification"
        style={{
          width: 500,
          margin: "5% auto",
        }}
      >
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true, email: email }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
          autoComplete="off"
          size="middle"
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
              placeholder="E-mail"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Send Verification Email
            </Button>
          </Form.Item>
          {hasErrors && !isVerified && (
            <Alert message={errorMessage} type="error" showIcon />
          )}
          {hasErrors && isVerified && (
            <Alert
              message={errorMessage}
              description="O.K. to try logging into your account with this email."
              type="info"
              showIcon
            />
          )}
          {emailSent ? (
            <Alert
              message={`Email sent: ${errorMessage}`}
              type="success"
              showIcon
            />
          ) : null}
        </Form>
      </Card>
    </Content>
  );
}

export default EmailReVerification;
