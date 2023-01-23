import React, { useState } from "react";
import { Form, Button, Input, Space, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";

import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";

function EmailForm(props) {
  const [email, setEmail] = useState(props.email);
  const [successful, setSuccessful] = useState(false);
  const [eMessage, setEMessage] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const [form] = Form.useForm();

  const onFinish = ({ email }) => {
    const formData = new FormData();
    if (email) {
      formData.append("email", email.trim());
    }

    AuthService.updateProfile(formData)
      .then(({ data: response }) => {
        const { message, errorStatus, errorFlag } = response;
        if (!errorFlag) {
          TokenService.updateLocalEmail(email);
          setEmail(email);
          setSuccessful(response.emailChanged.status);
          if (response.emailChanged.status) {
            setEMessage(
              `Email pending change from "${response.emailChanged.oldValue}" to "${response.emailChanged.newValue}". Check your "${response.emailChanged.newValue}" inbox for link to verify and confirm change.`
            );
          } else {
            setEMessage("");
          }
          props.setEmail(email);
        } else {
          switch (errorStatus) {
            case "EMAIL_INVALID":
              setEMessage(
                `The email "${email}" is already in use on another account!`
              );
              setSuccessful(false);
              break;
            default:
              setEMessage(message);
              setSuccessful(false);
          }
          // } else {
          // }
        }
      })
      .catch((error) => {
        console.log("Email Update error: ", error);
      });
  };

  const onValuesChange = ({ email }) => {
    if (email.trim() !== props.email) {
      setEmailChanged(true);
    } else {
      setEmailChanged(false);
    }
  };
  const onReset = (e) => {
    form.setFieldsValue({ email: email });
    setEmailChanged(false);
    setEMessage("");
  };

  return (
    <Form
      form={form}
      name="emailaddress"
      initialValues={{ remember: true, email: email }}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="Email Address"
        name="email"
        rules={[
          { required: true, message: "Please input your Email address!" },
          { type: "email", message: "The input is not a valid Email" },
        ]}
        tooltip="Where do you want us to send email notifications?"
        hasFeedback
      >
        <Input
          style={{
            backgroundColor: "var(--dk-gray-400)",
            borderRadius: "8px",
          }}
          type="email"
          addonBefore={<MailOutlined />}
          allowClear
          placeholder="Email address"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          {emailChanged ? (
            <Button type="primary" htmlType="submit">
              Change Email
            </Button>
          ) : (
            <Button disabled type="primary" htmlType="submit">
              Change Email
            </Button>
          )}
          <Button type="default" onClick={onReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
      {eMessage && !successful ? (
        <Alert closable message={eMessage} type="error" showIcon />
      ) : null}
      {eMessage && successful ? (
        <Alert closable message={eMessage} type="success" showIcon />
      ) : null}
    </Form>
  );
}

export default EmailForm;
