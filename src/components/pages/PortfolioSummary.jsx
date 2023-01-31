import React, { useState } from "react";
import { Typography } from "antd";

import "./PortfolioSummary.css";
import { useEffect } from "react";

const { Title } = Typography;

function PortfolioSummary({ portfolioId, portfolios }) {
  const [id, setId] = useState(portfolioId);
  const [portfolioDetail, setPortfolioDetail] = useState({});

  useEffect(() => {
    // Pull the detail object from the list of portfolios, convert portfolioId if it is a name rather than an id - using find to determine if that is the case...
    if (portfolios.length > 0) {
      console.log(portfolioId);
      const portfolio = portfolios.find((item) => item._id === portfolioId)
        ? portfolios.find((item) => item._id === portfolioId)
        : portfolios.find((item) => item.portfolioName === portfolioId);
      console.log("portfolio: ", portfolio);
      setId(portfolio._id);
      setPortfolioDetail(portfolio);
    }
  }, [portfolioId, portfolios]);

  // console.log("portfolios: ", portfolios, id);
  return (
    <div className="portfolio-summary">
      <Title className="portfolio-summary" level={1}>
        Selected Portfolio: {portfolioDetail.portfolioName}, {id}
      </Title>
    </div>
  );
}

export default PortfolioSummary;
