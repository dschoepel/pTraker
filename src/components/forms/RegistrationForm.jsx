import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Input, Typography, Alert, Divider, Space } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { PasswordInput } from "antd-password-input-strength";

import taiPasswordStrength from "tai-password-strength";
import zxcvbn from "zxcvbn";
import PasswordService from "../services/passsword.service";

import AuthService from "../services/auth.service";

import "./RegistrationForm.css";

const strengthTester = new taiPasswordStrength.PasswordStrength();
strengthTester.addCommonPasswords(taiPasswordStrength.commonPasswords);
strengthTester.addTrigraphMap(taiPasswordStrength.trigraphs);

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [eMessage, setEMessage] = useState("");
  const navigate = useNavigate();
  const nameInput = useRef(null);

  useEffect(() => {
    if (nameInput.current) {
      nameInput.current.focus();
    }
  }, [nameInput]);

  function getErrorMsg(statusCode, message) {
    let errorMessage = "";
    switch (statusCode) {
      case "USERNAME_IN_USE":
        errorMessage = "Full name is already in use on another account!";
        break;
      case "EMAIL_IN_USE":
        errorMessage = "E-mail is already being used by another account!";
        break;
      default:
        errorMessage = message;
    }
    return errorMessage;
  }

  // Cancel button - navigate to home
  const onCancel = () => {
    navigate("/");
  };

  const onFinish = () => {
    AuthService.register(username, email, password, confirmPassword)
      .then(
        (response) => {
          console.log("Response from Signup: ", response, response.success);
          if (response.success) {
            navigate("/verifyRegistration");
          }
          setEMessage(
            getErrorMsg(response.data.errorStatus, response.data.message)
          );
          setSuccessful(response.success);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setEMessage(resMessage);
          setSuccessful(false);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Registration Failed: ", errorInfo);
  };

  const onValuesChange = ({ name, email, password, confirmPassword }) => {
    if (name) {
      setUsername(name.trim());
    }
    if (email) {
      setEmail(email.toLowerCase());
    }
    if (password) {
      setPassword(password.trim());
    }
    if (confirmPassword) {
      setConfirmPassword(confirmPassword.trim());
    }
  };

  return (
    <div>
      <h2 className="registration-form-title">pTracker Account Signup</h2>
      <Divider
        style={{ marginTop: "5px", backgroundColor: "var(--navbar-bg-color)" }}
      />
      <Form
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
        autoComplete="off"
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
            className="registration-form-addon-icon"
            addonBefore={<UserOutlined />}
            allowClear
            placeholder="Full Name or Nickname"
            ref={nameInput}
          />
        </Form.Item>
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
            className="registration-form-addon-icon"
            addonBefore={<MailOutlined />}
            allowClear
            placeholder="E-mail"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            {
              validator: (_, value) => {
                var scored = 0;
                var scoremsg = "";
                if (password.length > 0) {
                  var { score } = zxcvbn(password);
                  scored = score;
                  scoremsg = PasswordService.scoreText(value);
                }
                if (value === "" || scored > 2) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(new Error(scoremsg));
                }
              },
            },
          ]}
          hasFeedback
        >
          <PasswordInput
            className="registration-form-addon-icon"
            addonBefore={<LockOutlined />}
            allowClear
            placeholder="password"
          />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please re-enter your password to confirm!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("password").trim() === value.trim()
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "This password does not match the other password you entered!"
                  )
                );
              },
            }),
          ]}
          hasFeedback
        >
          <PasswordInput
            className="registration-form-addon-icon"
            addonBefore={<SafetyOutlined />}
            allowClear
            placeholder="confirmPassword"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Signup
            </Button>
          </Space>
        </Form.Item>
        {eMessage && !successful ? (
          <Alert message={eMessage} type="error" showIcon />
        ) : null}
      </Form>
    </div>
  );
};

export default Register;
