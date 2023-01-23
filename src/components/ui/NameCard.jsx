import React from "react";
import { Card } from "antd";

import NameForm from "../forms/NameForm";

function NameCard(props) {
  console.log("NameCard props: ", props);
  return (
    <Card className="card-grid" bordered={false}>
      <NameForm username={props.username} setAuthor={props.setAuthor} />
    </Card>
  );
}

export default NameCard;
