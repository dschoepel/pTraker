import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Input, Alert, Spin, Space, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";
import AuthContext from "../store/auth.context";

import "./CreatePortfolioForm.css";
import { TbFileDollar } from "react-icons/tb";
import PortfolioService from "../services/portfolio.service";

const CreatePortfolioForm = ({ handleCancel, onOk }) => {
  let navigate = useNavigate();
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioDescription, setPortfolioDescription] = useState("");
  const [assets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eMessage, setEMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const portfolioNameInput = useRef(null);

  useEffect(() => {
    if (portfolioNameInput.current) {
      portfolioNameInput.current.focus();
    }
  }, [portfolioNameInput]);

  function getErrorMsg(statusCode, message) {
    let errorMessage = "";
    switch (statusCode) {
      case "PORTFOLIO_NAME_ERROR":
        errorMessage = `You already have a portfolio with this name: ${portfolioName}!`;
        break;
      default:
        errorMessage = message;
    }
    return errorMessage;
  }

  function onFinish({ portfolioName, portfolioDescription }) {
    setLoading(true);
    PortfolioService.addUserPortfolio(
      portfolioName,
      portfolioDescription,
      assets
    )
      .then(
        (response) => {
          console.log(
            "Response from Create portfolio: ",
            response,
            response?.success
          );
          if (response.success) {
            setSuccessful(true);
            console.log("success about to navigate");
            navigate("/");
          }
          console.log("....>", response);
          setEMessage(
            getErrorMsg(response.data.errorStatus, response.data.message)
          );
          setSuccessful(response.data.success);
        },
        (error) => {
          console.log("-----> ", error);

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
      .catch((error) => {});
    setLoading(false);
  }

  function onValuesChange(portfolioName, portfolioDescription) {
    if (portfolioName) {
      setPortfolioName(portfolioName);
    }
    if (portfolioDescription) {
      setPortfolioDescription(portfolioDescription);
    }
  }
  return (
    <Form
      className="portfolio-create-form-style"
      name="createPortfolio"
      labelCol={{ span: 12 }}
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      autoComplete="off"
    >
      <Form.Item
        label="Portfolio Name"
        name="portfolioName"
        rules={[
          {
            required: true,
            message: "Please enter a name for your new portfolio!",
          },
          { type: "text" },
          { whitespace: true },
          {
            min: 5,
            message: "Name must be at least 5 characters!",
          },
        ]}
        tooltip="A short name is best!  The description can be used to provide additional details."
        hasFeedback
      >
        <Input
          className="portfolio-create-addon-icon"
          addonBefore={<TbFileDollar />}
          allowClear
          placeholder="Enter portfolio name"
          ref={portfolioNameInput}
        />
      </Form.Item>
      <Form.Item
        label="Portfolio Description"
        name="portfolioDescription"
        rules={[
          {
            required: true,
            message: "Please enter a description for your new portfolio!",
          },
          { type: "text" },
          { whitespace: true },
          {
            min: 10,
            message: "Description must be at least 10 characters!",
          },
        ]}
        tooltip="The description can be used to provide additional details about the purpose/contents of the portfolio."
        hasFeedback
      >
        <Input.TextArea
          // addonBefore={<TbFileDescription />}
          allowClear
          placeholder="Enter the portfolio description"
          autoSize
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            form="createPortfolio"
            key="submit"
            type="primary"
            htmlType="submit"
          >
            Create Portfolio
          </Button>
        </Space>
      </Form.Item>
      {loading && <Spin tip="Creating portfolio..." />}
      {eMessage && !successful ? (
        <Alert message={eMessage} type="error" showIcon />
      ) : null}
    </Form>
  );
};

export default CreatePortfolioForm;
