import React from "react";
import { Card } from "antd";

import NameForm from "../forms/NameForm";

// The NameCard component is a Card that contains the NameForm component.
// It is used to display the NameForm component on the Home page.
// The NameForm component is used to set the author name for the application.
// The author name is used to identify the user in the application.
function NameCard(props) {
  console.log("NameCard props: ", props);
  return (
    <Card className="card-grid" bordered={false}>
      <NameForm username={props.username} setAuthor={props.setAuthor} />
    </Card>
  );
}

export default NameCard;
