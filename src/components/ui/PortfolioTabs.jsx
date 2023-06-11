import React, { useState, useContext, useEffect } from "react";
import { Layout, Tooltip, Tabs } from "antd";
import { useNavigate } from "react-router-dom";

import { UserNetWorthContext } from "../store/userNetWorth.context";
import PortfolioService from "../services/portfolio.service";

import "./PortfolioTabs.css";

function PortfolioTabs() {
  const [currentPortfolioId, setCurrentPortfolioId] = useState(
    PortfolioService.getLocalPortfolioId()
  );
  const [userNetWorthContext] = useContext(UserNetWorthContext);
  const { portfolioSummaries } = userNetWorthContext;
  const navigate = useNavigate();

  let tagData = [];
  tagData = portfolioSummaries.map((portfolio) => {
    return {
      label: (
        <div>
          <Tooltip title={portfolio.portfolioDescription}>
            <div style={{ color: "var(--dk-gray-500)" }}>
              {portfolio.portfolioName}
            </div>
          </Tooltip>
        </div>
      ),
      key: portfolio.portfolioId,
    };
  });

  useEffect(() => {}, []);

  const tabChanged = (portfolioId) => {
    console.log("Segment selected is: ", portfolioId);
    PortfolioService.setLocalPortfolioId(portfolioId);
    navigate(`/dashboard/${portfolioId}`);
  };

  return (
    <Layout.Content>
      <Tabs
        type="line"
        onChange={tabChanged}
        items={tagData}
        centered={false}
      ></Tabs>
    </Layout.Content>
  );
}

export default PortfolioTabs;
