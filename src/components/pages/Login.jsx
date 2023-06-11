import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Modal } from "antd";

// import { ImageContext } from "../store/image.context";
import LoginForm from "../forms/LoginForm";
import ResetPasswordForm from "../forms/ResetPasswordForm";
import { contentStyle } from "../ui/ContentStyle";

import "./Login.css";

const { Content } = Layout;

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [forgotpassword, setForgotPassword] = useState(false);
  // const [imageContext, setImageContext] = useContext(ImageContext);

  let navigate = useNavigate();

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleForgotPassword = () => {
    console.log("clicked forgot password");
    setForgotPassword(true);
  };

  return (
    <Content style={contentStyle}>
      <Modal
        bodyStyle={{ backgroundColor: "var(--dk-dark-bg)" }}
        title="pTracker Login"
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        wrapClassName="login-modal-style"
      >
        <LoginForm />
        <Link onClick={handleForgotPassword}>Forgot Password?</Link>
        {forgotpassword ? (
          <>
            <ResetPasswordForm />
          </>
        ) : null}
      </Modal>
    </Content>
  );
};

export default Login;
