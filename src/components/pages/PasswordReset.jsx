import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout, Form, Button, Card, Alert } from "antd";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons";

import AuthContext from "../store/auth.context";

import AuthService from "../services/auth.service";
import { PasswordInput } from "antd-password-input-strength";
import taiPasswordStrength from "tai-password-strength";
import zxcvbn from "zxcvbn";
import { contentStyle } from "../ui/ContentStyle";

const { Content } = Layout;
const strengthTester = new taiPasswordStrength.PasswordStrength();
strengthTester.addCommonPasswords(taiPasswordStrength.commonPasswords);
strengthTester.addTrigraphMap(taiPasswordStrength.trigraphs);

function PasswordReset(props) {
  const authCtx = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [queryParameters] = useSearchParams();

  const token = queryParameters.get("token");
  const id = queryParameters.get("id");

  let navigate = useNavigate();

  console.log("Query Params: ", queryParameters, "token: ", token, "id: ", id);

  const logMeIn = (email, password) => {
    AuthService.login(email, password).then((response) => {
      console.log("Logmein: ", response);
      if (response.success) {
        authCtx.aLogin(response.accessToken);
        navigate("/");
      }
    });
  };

  const onFinish = (values) => {
    console.log(token, id, password, confirmPassword);
    // ReVerifyEmail.reVerifyEmail(
    //   email,
    //   setEmailSent,
    //   setErrorMessage,
    //   setHasErrors,
    //   setIsVerified
    // );
    AuthService.resetPassword(id, token, password, confirmPassword)
      .then((response) => {
        const { success, data, statusCode } = response;
        const { errorFlag, errorStatus, email } = data;
        var eMessage = data.message;
        console.log(
          "Response: ",
          success,
          eMessage,
          errorFlag,
          errorStatus,
          statusCode,
          email
        );
        setErrorMessage(eMessage);
        setIsPasswordReset(success);
        if (!success) {
          setHasErrors(true);
        } else {
          logMeIn(email, password);
        }
      })
      .catch(() => {});
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Password Change Failed: ", errorInfo);
  };

  function scoreText(password) {
    var strength = {
      0: "Worst: ",
      1: "Bad: ",
      2: "Weak: ",
      3: "Good: ",
      4: "Strong: ",
    };

    var result = zxcvbn(password);
    let text = "";
    let warning = "";
    if (result.feedback.warning.length > 0) {
      warning = result.feedback.warning.endsWith(".")
        ? warning
        : result.feedback.warning + ".";
    }
    result.feedback.suggestions.forEach((suggestion) => {
      text = " " + suggestion.endsWith(".") ? suggestion : suggestion + ". ";
    });
    if (password !== "") {
      text = strength[result.score] + "  " + warning + " " + text;
    }
    return text;
  }

  const onValuesChange = (changedValues) => {
    // if (changedValues?.email) {
    //   setEmail(changedValues.email);
    // }
    if (changedValues?.password) {
      setPassword(changedValues.password.trim());
      const { strengthCode } = strengthTester.check(password);
      console.log("Pwd Strength Name: ", strengthCode);
      const zStrength = zxcvbn(changedValues.password);
      console.log(zStrength);
    }
    if (changedValues?.confirmPassword) {
      setConfirmPassword(changedValues.confirmPassword.trim());
    }
  };

  return (
    <Content style={contentStyle}>
      <Card
        title="Reset Password"
        style={{
          width: 500,
          margin: "5% auto",
        }}
      >
        <Form
          name="passwordChange"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
          autoComplete="off"
          size="middle"
        >
          <Form.Item
            label="New Password"
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
                    scoremsg = scoreText(value);
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
              addonBefore={<LockOutlined />}
              allowClear
              placeholder="New Password"
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
              addonBefore={<SafetyOutlined />}
              allowClear
              placeholder="Confirm New Password"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Save New Password
            </Button>
          </Form.Item>
          {hasErrors && <Alert message={errorMessage} type="error" showIcon />}
          {isPasswordReset && (
            <Alert
              message={errorMessage}
              description="You have been logged in..."
              type="success"
              showIcon
            />
          )}
          <h5>Your password must:</h5>
          <ul style={{ fontSize: "70%", marginLeft: "1.75rem" }}>
            <li>Include an UPPER and lowercase letter</li>
            <li>Include a number</li>
            <li>
              Include one or more of these special characters: !@#$%^&*()_=+
            </li>
            <li>Be between 10 and 100 characters</li>
          </ul>
        </Form>
      </Card>
    </Content>
  );
}

export default PasswordReset;
