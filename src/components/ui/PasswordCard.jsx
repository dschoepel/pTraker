import React from "react";
import { Card } from "antd";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import "./PasswordCard.css";

function PasswordCard(props) {
  return (
    <Card className="password card-grid" bordered={false}>
      <ChangePasswordForm />
    </Card>
  );
}

export default PasswordCard;
