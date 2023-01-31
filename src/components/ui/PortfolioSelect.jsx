import React, { useState } from "react";
import { Select } from "antd";

import "./PortfolioSelect";

function PortfolioSelect({
  userPortfolios,
  setSelectedPortfolio,
  selectedPortfolio,
  defaultValue,
}) {
  const [options, setOptions] = useState(userPortfolios ? userPortfolios : []);
  const [selectedValue] = useState(defaultValue);

  const handleChange = (value) => {
    console.log("Menu Clicked", value);
    setSelectedPortfolio(value);
  };

  const onDropdownVisibleChange = () => {
    setOptions(userPortfolios ? userPortfolios : []);
  };

  console.log("UserPortfolios: ", userPortfolios);
  console.log("Selected Portfolio: ", defaultValue);

  return (
    <>
      <Select
        onDropdownVisibleChange={onDropdownVisibleChange}
        className="portfolio-select"
        labelInValue={true}
        value={selectedPortfolio}
        defaultValue={selectedValue}
        placeholder="Select portfolio"
        style={{ width: "15em" }}
        bordered={true}
        size="large"
        autoFocus={true}
        onChange={handleChange}
        options={options.map((portfolio) => ({
          value: portfolio._id,
          label: portfolio.portfolioName,
        }))}
      />
    </>
  );
}

export default PortfolioSelect;
