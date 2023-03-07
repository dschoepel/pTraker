import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Space, Input, Alert, Spin, Modal, Layout } from "antd";
import { TbFileDollar } from "react-icons/tb";

import PortfolioService from "../services/portfolio.service";
import { contentStyle } from "../ui/ContentStyle";
import "./EditPortfolio.css";

const { Content } = Layout;

function EditPortfolio({
  record,
  isModalOpen,
  setIsModalOpen,
  setPortfolioChanged,
}) {
  const [portfolioName, setPortfolioName] = useState(
    record.portfolioDetail.portfolioName.trim()
  );
  const [portfolioDescription, setPortfolioDescription] = useState(
    record.portfolioDetail.portfolioDescription.trim()
  );
  // const [nameChanged, setNameChanged] = useState(false);
  // const [descriptionChanged, setDescriptionChanged] = useState(false);
  const [allowSaveChanges, setAllowSaveChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eMessage, setEMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [editPortfolioForm] = Form.useForm();

  const portfolioNameInput = useRef(null);

  useEffect(() => {
    console.log("record in: ", record);
    if (portfolioNameInput.current) {
      portfolioNameInput.current.focus();
    }
  }, [portfolioNameInput, record]);

  // TODO Modify for changing portfolio names...
  function getErrorMsg(statusCode, message) {
    let errorMessage = "";
    switch (statusCode) {
      case "PORTFOLIO_NOT_CHANGED":
        errorMessage = `No changes were made for: ${portfolioName}!`;
        break;
      default:
        errorMessage = message;
    }
    return errorMessage;
  }

  function handleOk() {
    editPortfolioForm.submit();
  }

  function onFinish({ portfolioName, portfolioDescription }) {
    setLoading(true);
    PortfolioService.editPortfolio(
      portfolioName,
      portfolioDescription,
      record.portfolioDetail._id
    )
      .then(
        (response) => {
          console.log(
            "Response from Edit portfolio: ",
            response,
            response.success
          );
          if (response.success) {
            setSuccessful(true);
            setIsModalOpen(false);
            setPortfolioChanged({
              changed: true,
              changeType: "EDIT_PORTFOLIO",
              portfolioId: record.portfolioDetail._id,
            });
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

  function onValuesChange(values) {
    let nameChgd = false;
    let descChgd = false;

    if (values.portfolioName) {
      if (
        values.portfolioName !== record.portfolioDetail.portfolioName.trim()
      ) {
        nameChgd = true;
        setPortfolioName(values.portfolioName.trim());
      } else {
        nameChgd = false;
      }
    }

    if (values.portfolioDescription) {
      if (
        values.portfolioDescription !==
        record.portfolioDetail.portfolioDescription.trim()
      ) {
        descChgd = true;
        setPortfolioDescription(values.portfolioDescription.trim());
      } else {
        descChgd = false;
      }
    }

    if (nameChgd || descChgd) {
      setAllowSaveChanges(true);
    } else {
      setAllowSaveChanges(false);
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    editPortfolioForm.resetFields();
  };

  return (
    <Content style={contentStyle}>
      <Modal
        destroyOnClose={true}
        bodyStyle={{ backgroundColor: "var(--dk-dark-bg)" }}
        title="Edit Portfolio"
        footer={null}
        okText="Save Changes"
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        wrapClassName="portfolio-edit-modal-style"
        onOk={handleOk}
      >
        <Form
          className="portfolio-edit-form-style"
          form={editPortfolioForm}
          labelCol={{ xs: { span: 12 } }}
          wrapperCol={{ xs: { span: 12 } }}
          initialValues={{
            remember: true,
            portfolioName: portfolioName,
            portfolioDescription: portfolioDescription,
          }}
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
              className="portfolio-edit-addon-icon"
              addonBefore={
                <TbFileDollar
                  className={"portfolio-create-icon"}
                  size={"1.5em"}
                />
              }
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
              allowClear
              placeholder="Enter the portfolio description"
              autoSize
            />
          </Form.Item>

          <div className="portfolio-edit-buttons">
            <Space wrap={true}>
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>
              {allowSaveChanges ? (
                <Button type="primary" onClick={handleOk} key="submit">
                  Save Changes
                </Button>
              ) : (
                <Button disabled type="primary" onClick={handleOk} key="submit">
                  Save Changes
                </Button>
              )}
            </Space>
          </div>
          {loading && <Spin tip="Saving changes to the portfolio..." />}
          {eMessage && !successful ? (
            <Alert message={eMessage} type="error" showIcon />
          ) : null}
        </Form>
      </Modal>
    </Content>
  );
}
export default EditPortfolio;
