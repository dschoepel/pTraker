import { Card, Row, Button } from "antd";
import { Fragment, useState } from "react";
import { RiPlayListAddLine } from "react-icons/ri";

import CreatePortfolio from "../pages/CreatePortfolio";

function NoPortfolio({ setListChanged }) {
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState(false);

  const onClickCreatePortfolio = () => {
    console.log("create portfolio clicked");
    setIsAddPortfolioModalOpen(true);
  };

  return (
    <Fragment>
      <Card
        hoverable={false}
        size="small"
        bordered={false}
        className="portfolio-summary-card-empty"
      >
        <Row
          justify="space-around"
          className="portfolio-summary-card-empty-row"
        >
          Click the "Create Portfolio" button below to start defining your first
          porfolio and begin tracking your assets.
        </Row>
        <Row justify="space-around">
          <Button
            className="dashboard-button"
            type="primary"
            onClick={onClickCreatePortfolio}
          >
            <RiPlayListAddLine className="dashboard-icon" /> Create Portfolio
          </Button>
        </Row>
      </Card>
      {isAddPortfolioModalOpen ? (
        <CreatePortfolio
          setIsAddPortfolioModalOpen={setIsAddPortfolioModalOpen}
          isAddPortfolioModalOpen={isAddPortfolioModalOpen}
          setListChanged={setListChanged}
        />
      ) : null}
    </Fragment>
  );
}

export default NoPortfolio;
