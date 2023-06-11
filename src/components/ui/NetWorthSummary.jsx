import { Fragment, useContext } from "react";
import { Row, Col, Card, Typography, Grid } from "antd";

import { UserNetWorthContext } from "../store/userNetWorth.context";

import "./NetWorthSummary.css";
import FormattedNumber from "../ui/FormattedNumber";

const { useBreakpoint } = Grid;
const { Paragraph } = Typography;

function NetWorthSummary({
  data: { netWorth, daysChange, totalBookValue, totalReturn },
  title,
}) {
  const [userNetWorthContext] = useContext(UserNetWorthContext);

  console.log("userNetworthContext: ", userNetWorthContext);
  const { xs, sm, md, lg, xl } = useBreakpoint();
  // console.log("Screens xs, sm, md, lg, xl: ", xs, sm, md, lg, xl);
  return (
    <Fragment>
      <Card
        hoverable={false}
        size="small"
        bordered={false}
        className="networth-card"
      >
        {/* First row */}
        <Row
          justify={"start"}
          className="networth-card-heading"
          key={"heading"}
          align="bottom"
        >
          <Col flex="0 0 90px">
            <Paragraph className="networth-card-heading">
              {`${title} Net Worth`}
            </Paragraph>
            <Paragraph className="user-networth-card-net-worth">
              <FormattedNumber value={netWorth} type="CURRENCY" digits={0} />
            </Paragraph>
          </Col>
          <Col flex="0 1 90px">
            <Paragraph className="networth-card-heading">
              Day's Change
            </Paragraph>
            <Paragraph className="user-networth-card-color">
              <FormattedNumber
                value={daysChange}
                type="CURRENCY"
                color={true}
                digits={0}
              />
            </Paragraph>
          </Col>
          {!xs ? (
            <Fragment>
              <Col flex="0 1 90px">
                <Paragraph className="networth-card-heading">
                  Book Value
                </Paragraph>
                <Paragraph className="user-networth-bookvalue">
                  <FormattedNumber
                    value={totalBookValue}
                    type="CURRENCY"
                    digits={0}
                  />
                </Paragraph>
              </Col>
              <Col flex="0 1 90px">
                <Paragraph className="networth-card-heading">
                  Total Return
                </Paragraph>
                <Paragraph className="user-networth-card-color">
                  <FormattedNumber
                    value={totalReturn}
                    type="CURRENCY"
                    color={true}
                    digits={0}
                  />
                </Paragraph>
              </Col>
            </Fragment>
          ) : null}
        </Row>
      </Card>
    </Fragment>
  );
}
export default NetWorthSummary;
