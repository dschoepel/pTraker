import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Input, Alert, Spin, Modal, Layout } from "antd";
import { TbFileDollar } from "react-icons/tb";

import PortfolioService from "../services/portfolio.service";
import { contentStyle } from "../ui/ContentStyle";
import "./CreatePortfolio.css";

const { Content } = Layout;

function CreatePortfolio({ isModalOpen, setIsModalOpen, setPortfolioChanged }) {
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioDescription, setPortfolioDescription] = useState("");
  const [assets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eMessage, setEMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [createPortfolioForm] = Form.useForm();

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

  function handleOk() {
    createPortfolioForm.submit();
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
            response.success
          );
          if (response.success) {
            setSuccessful(true);
            console.log("success about to navigate");
            // navigate("/myProfile");
            setIsModalOpen(false);
            setPortfolioChanged(true);
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
      .catch();
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

  const handleCancel = () => {
    setIsModalOpen(false);
    createPortfolioForm.resetFields();
  };

  return (
    <Content style={contentStyle}>
      <Modal
        destroyOnClose={true}
        bodyStyle={{ backgroundColor: "var(--dk-dark-bg)" }}
        title="Create a New Portfolio"
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button type="primary" onClick={handleOk} key="submit">
            Create Portfolio
          </Button>,
        ]}
        okText="Create Portfolio"
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        wrapClassName="portfolio-create-modal-style"
        onOk={handleOk}
      >
        <Form
          className="portfolio-create-form-style"
          form={createPortfolioForm}
          labelCol={{ xs: { span: 12 } }}
          wrapperCol={{ xs: { span: 12 } }}
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
            {/* <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                form="createPortfolio"
                key="submit"
                type="primary"
                htmlType="submit"
              >
                Create Portfolio
              </Button>
            </Space> */}
          </Form.Item>
          {/* <Button form="createPortfolio" key="submit" htmlType="submit">
            Create Portfolio
          </Button> */}
          {loading && <Spin tip="Creating portfolio..." />}
          {eMessage && !successful ? (
            <Alert message={eMessage} type="error" showIcon />
          ) : null}
        </Form>
      </Modal>
    </Content>
  );
}

export default CreatePortfolio;
