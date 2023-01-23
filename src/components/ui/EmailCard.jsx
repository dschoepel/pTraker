import React from "react";
import { Card } from "antd";

import EmailForm from "../forms/EmailForm";
import "./EmailCard.css";

function EmailCard(props) {
  console.log("Email Card props: ", props);
  return (
    <Card className="email-card card-grid" bordered={false}>
      <EmailForm email={props.email} setEmail={props.setEmail} />
    </Card>
  );
}

export default EmailCard;
