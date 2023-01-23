import React, { useState } from "react";
import { Form, Button, Alert } from "antd";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { PasswordInput } from "antd-password-input-strength";
import taiPasswordStrength from "tai-password-strength";
import zxcvbn from "zxcvbn";

import AuthService from "../services/auth.service";
import PasswordService from "../services/passsword.service";

import "./ChangePasswordForm.css";

const strengthTester = new taiPasswordStrength.PasswordStrength();
strengthTester.addCommonPasswords(taiPasswordStrength.commonPasswords);
strengthTester.addTrigraphMap(taiPasswordStrength.trigraphs);

function ChangePasswordForm(props) {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const onFinish = () => {
    AuthService.changePassword(currentPassword, newPassword, confirmPassword)
      .then((response) => {
        // response object {success, data, statusCode}
        const { success, data } = response;
        // data object {errorFlag, errorStatus, email, message}
        const { message } = data;
        // var eMessage = message;
        setErrorMessage(message);
        setIsPasswordReset(success);
        if (!success) {
          setHasErrors(true);
        } else {
          setHasErrors(false);
        }
      })
      .catch(() => {});
  };

  const onValuesChange = ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    if (currentPassword) {
      setCurrentPassword(currentPassword.trim());
    }
    if (newPassword) {
      setNewPassword(newPassword.trim());
    }
    if (confirmPassword) {
      setConfirmPassword(confirmPassword.trim());
    }
  };

  return (
    <div>
      <Form
        className="password-form"
        name="changePassword"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        autoComplete="off"
        size="middle"
        layout="vertical"
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[
            { required: true, message: "Please input your current password!" },
          ]}
          tooltip="Your current password is required to make this change."
          hasFeedback
        >
          <PasswordInput
            addonBefore={<LockOutlined />}
            allowClear
            placeholder="Current Password"
          />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please input your password!" },
            {
              validator: (_, value) => {
                var scored = 0;
                var scoremsg = "";
                if (newPassword.length > 0) {
                  var { score } = zxcvbn(newPassword);
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
          tooltip="What to you want to change your new password to?"
          hasFeedback
        >
          <PasswordInput
            addonBefore={<LockOutlined />}
            allowClear
            placeholder="New Password"
          />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Please re-enter your password to confirm!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("newPassword").trim() === value.trim()
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
          tooltip="Re-enter your New password to confirm this is the value to be used."
          hasFeedback
        >
          <PasswordInput
            addonBefore={<SafetyOutlined />}
            allowClear
            placeholder="Confirm New Password"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Change Password
          </Button>
        </Form.Item>
        {hasErrors && <Alert message={errorMessage} type="error" showIcon />}
        {isPasswordReset ? (
          <Alert message={errorMessage} closable type="success" showIcon />
        ) : null}
        <h5>Your password must:</h5>
        <ul
        // style={{
        //   fontSize: "70%",
        //   marginLeft: "1.75rem",
        //   color: "var(--dk-gray-500)",
        // }}
        >
          <li>Include an UPPER and lowercase letter</li>
          <li>Include a number</li>
          <li>
            Include one or more of these special characters: !@#$%^&*()_=+
          </li>
          <li>Be between 10 and 100 characters</li>
        </ul>
      </Form>
    </div>
  );
}

export default ChangePasswordForm;
