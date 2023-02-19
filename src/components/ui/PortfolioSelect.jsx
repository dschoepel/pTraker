import React, { useState, useContext } from "react";
import { Select } from "antd";

import "./PortfolioSelect";
import { PortfolioContext } from "../store/portfolio.context";
import PortfolioService from "../services/portfolio.service";

function PortfolioSelect({
  userPortfolios,
  setSelectedPortfolio,
  selectedPortfolio,
  defaultValue,
  setPortfolioChanged,
}) {
  const [portfolioContext, setPortfolioContext] = useContext(PortfolioContext);
  const [options, setOptions] = useState(userPortfolios ? userPortfolios : []);
  const [selectedValue] = useState(defaultValue);

  const handleChange = (value) => {
    // console.log("Menu Clicked", value);
    // setSelectedPortfolio(value);
  };

  const onSelection = async (value) => {
    const portfolioDetail = await PortfolioService.getOnePortfolio(value.value);
    console.log("on Selection: ", portfolioDetail.data);
    console.log("Selected", value);
    setSelectedPortfolio({
      label: portfolioDetail.data.portfolioDetail.portfolioName,
      value: portfolioDetail.data.portfolioDetail._id,
    });

    setPortfolioContext({
      ...portfolioDetail.data,
      label: portfolioDetail.data.portfolioDetail.portfolioName,
      value: portfolioDetail.data.portfolioDetail._id,
    });
    // setPortfolioChanged(true);
  };

  const onDropdownVisibleChange = () => {
    // console.log("dropdown visible change happened");
    // setOptions(userPortfolios ? userPortfolios : []);
  };

  // console.log("UserPortfolios: ", userPortfolios);
  // console.log("Selected Portfolio: ", defaultValue);

  return (
    <>
      {portfolioContext.value ? (
        <Select
          onDropdownVisibleChange={onDropdownVisibleChange}
          className="portfolio-select"
          labelInValue={true}
          value={portfolioContext}
          defaultValue={portfolioContext.value}
          placeholder="Select portfolio"
          style={{ width: "15em" }}
          bordered={true}
          size="large"
          autoFocus={true}
          // onChange={handleChange}
          onSelect={onSelection}
          options={options.map((portfolio) => ({
            value: portfolio._id,
            label: portfolio.portfolioName,
          }))}
        />
      ) : null}
    </>
  );
}

export default PortfolioSelect;
