import React, { Fragment } from "react";
import { Row, Col, Typography } from "antd";

import "./NewPortfolioHeading.css";

function NewPortfolioHeading({ portfolioName, portfolioDescription }) {
  return (
    <Fragment>
      <Row className="portfolio-heading-row" align={"top"}>
        <Col md={{ span: 24 }} sm={{ span: 20 }} className="portfolio-heading">
          <div>
            <Row align={"middle"}>
              <Col span={24}>
                <Typography.Text
                  ellipsis={true}
                  style={{
                    color: "var(--dk-gray-100",
                    fontSize: "2rem",
                  }}
                >
                  {portfolioName}
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text
                  style={{
                    color: "var(--dk-gray-500",
                    fontSize: "1rem",
                    fontStyle: "italic",
                  }}
                >
                  {portfolioDescription}
                </Typography.Text>
              </Col>
            </Row>
          </div>
        </Col>
        {/* <Col
          lg={{ span: 4, offset: 10 }}
          md={{ span: 3, offset: 8 }}
          sm={{ span: 2, offset: 4 }}
        >
          <Button
            className="dashboard-button"
            type="primary"
            onClick={onClickCreatePortfolio}
          >
            <RiPlayListAddLine className="dashboard-icon" /> Create Portfolio
          </Button>
        </Col> */}
      </Row>
    </Fragment>
  );
}

export default NewPortfolioHeading;
