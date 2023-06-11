import React, { useContext } from "react";
import { Col, Row, Tooltip } from "antd";

import { UserNetWorthContext } from "../store/userNetWorth.context";
import FormattedNumber from "./FormattedNumber";

import "./NetWorthTitle.css";

function NetWorthTitle({ size }) {
  const [userNetworthContext] = useContext(UserNetWorthContext);
  const {
    userSummary: { userNetWorth, userDaysChange },
  } = userNetworthContext;

  return (
    <Row align="bottom">
      <Col className={`networth-title ${size}`}>NetWorth:</Col>
      <Col className={`networth-title number ${size}`}>
        <FormattedNumber value={userNetWorth} type="CURRENCY" digits={0} />
      </Col>
      <Tooltip title="Day's Change">
        <Col className={`networth-title change ${size}`}>
          (
          <FormattedNumber
            value={userDaysChange}
            type="CURRENCY"
            color={true}
            changeArrow={false}
            digits={0}
          />
          )
        </Col>
      </Tooltip>
    </Row>
  );
}

export default NetWorthTitle;
