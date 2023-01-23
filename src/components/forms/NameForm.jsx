import React, { useState } from "react";

import { Form, Button, Input, Space, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";

import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";

function NameForm(props) {
  const [username, setUsername] = useState(props.username.trim());
  const [successful, setSuccessful] = useState(false);
  const [eMessage, setEMessage] = useState("");
  const [nameChanged, setNameChanged] = useState(false);
  const [form] = Form.useForm();

  const onFinish = ({ name }) => {
    const formData = new FormData();
    if (name) {
      formData.append("username", name.trim());
    }

    AuthService.updateProfile(formData)
      .then(({ data: response }) => {
        TokenService.updateLocalUsername(name);
        setUsername(name);
        setSuccessful(response.userNameChanged.status);
        if (response.userNameChanged.status) {
          setEMessage(
            `Username changed from ${response.userNameChanged.oldValue} to ${response.userNameChanged.newValue}`
          );
        } else {
          setEMessage("");
        }
        props.setAuthor(name);
      })
      .catch((error) => {
        console.log("Name Update: ", error);
      });
  };

  const onValuesChange = ({ name }) => {
    if (name.trim() !== props.username) {
      setNameChanged(true);
    } else {
      setNameChanged(false);
    }
  };

  const onReset = (e) => {
    form.setFieldsValue({ name: username });
    setNameChanged(false);
  };

  return (
    <Form
      form={form}
      name="username"
      labelCol={{ span: 16 }}
      wrapperCol={{ span: 32 }}
      initialValues={{ remember: true, name: username }}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="Full Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your full name or nickname!",
          },
          { type: "text" },
          { whitespace: true },
          {
            min: 5,
            message: "Name must be at least 5 characters!",
          },
        ]}
        tooltip="What to you want others to call you?"
        hasFeedback
      >
        <Input
          style={{ backgroundColor: "var(--dk-gray-400)", borderRadius: "8px" }}
          addonBefore={<UserOutlined />}
          allowClear
          placeholder="Full Name or Nickname"
        />
      </Form.Item>
      <Form.Item>
        <Space>
          {nameChanged ? (
            <Button type="primary" htmlType="submit">
              Change
            </Button>
          ) : (
            <Button disabled type="primary" htmlType="submit">
              Change
            </Button>
          )}
          <Button type="default" onClick={onReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
      {eMessage && !successful ? (
        <Alert message={eMessage} type="error" showIcon />
      ) : null}
      {eMessage && successful ? (
        <Alert closable message={eMessage} type="success" showIcon />
      ) : null}
    </Form>
  );
}

export default NameForm;
