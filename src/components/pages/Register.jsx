import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Modal } from "antd";

import RegistrationForm from "../forms/RegistrationForm";
import { contentStyle } from "../ui/ContentStyle";

import "./Register.css";

const { Content } = Layout;

const Register = () => {
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <Content style={contentStyle}>
      <Modal
        // title="pTracker Login"
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <RegistrationForm />
      </Modal>
    </Content>
  );
};

export default Register;
